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
        transaction.toId !== req.account.id
    ) return res.status(401).json({err: "notReciever"})

    //Check refund status
    if (transaction.refunded) return res.status(409).json({err: "alreadyRefunded"});

    //Get From
    const from = await transaction.getFrom();
    if (!from) return res.status(410).json({err: "senderNoLongerExists"});

    //Update Transaction
    await transaction.update({
        refunded: true
    });

    //Updated Balances
    await from.update({
		balance: from.balance + transaction.amount - transaction.fee
	});
	await req.account.update({
		balance: req.account.balance - transaction.amount + transaction.fee
	});

    //Response
    res.json({});
};