const db = require("../../util/db");
const config = require("../../config");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
	const {amount, meta} = req.body;

	if (
		typeof amount !== "number" ||
		amount < config.minAmount ||
		amount > config.maxAmount
	)
		return res.status(400).json({err: "invalidBodyParameters"});

	if (typeof meta !== "undefined") {
		if (
			typeof meta !== "string" ||
			meta.length < config.minMeta ||
			meta.length > config.maxMeta
		)
			return res.status(400).json({err: "invalidBodyParameters"});
	}

	//Prevent Paying Self
	if (req.params.id === req.account.id)
		return res.status(400).json({err: "cannotPaySelf"});

	//Get To Account
	const to = await db.AuAccount.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!to) return res.status(400).json({err: "invalidAccount"});

	//Check From Account has enough Au
	if (req.account.balance < amount)
		return res.status(400).json({err: "notEnoughAu"});

	//Create transaction
	const transaction = await db.AuTransaction.create({
		id: uuid(),
		amount,
		fee: config.fee,
		meta
	});
	await transaction.setFrom(req.account);
	await transaction.setTo(to);

	//Update Balances
	await req.account.update({
		balance: req.account.balance - amount
	});
	await to.update({
		balance: to.balance + amount - config.fee
	});

	//Add to Vault
	const vault = await db.AuAccount.findOne({
		where: {
			id: config.vault
		}
	});
	if (vault) {
		await vault.update({
			balance: vault.balance + config.fee
		});
	}

	//Response
	res.json({
		id: transaction.id
	});
};
