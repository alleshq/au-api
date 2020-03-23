const db = require("../../util/db");

module.exports = async (req, res) => {
	//Get Transaction
	const transaction = await db.AuTransaction.findOne({
		where: {
			id: req.params.id
		}
	});
	if (!transaction) return res.status(400).json({err: "invalidTransaction"});

	//Check Authorization to access transaction
	if (
		transaction.toId !== req.account.id &&
		transaction.fromId !== req.account.id
	)
		return res.status(401).json({err: "notInvolvedInTransaction"});

	//Response
	res.json({
		id: transaction.id,
		in: transaction.toId === req.account.id,
		participant:
			transaction.toId === req.account.id
				? transaction.fromId
				: transaction.toId,
		amount: transaction.amount,
		fee: transaction.fee,
		meta: transaction.meta,
		redirect: transaction.redirect,
		refunded: transaction.refunded,
		createdAt: transaction.createdAt
	});
};
