const {Op} = require("sequelize");

module.exports = async (req, res) => {
	//Transactions in the last 30 days
	const since = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30);

	//Get in/out transactions
	const inTransactions = await req.account.getInTransactions({
		where: {
			createdAt: {
				[Op.gte]: since
			}
		}
	});
	const outTransactions = await req.account.getOutTransactions({
		where: {
			createdAt: {
				[Op.gte]: since
			}
		}
	});

	//Concat into transactions
	var transactions = inTransactions.concat(outTransactions);

	//Sort
	transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	//Map
	transactions = transactions.map(t => ({
		id: t.id,
		in: t.toId === req.account.id,
		participant: t.toId === req.account.id ? t.fromId : t.toId,
		amount: t.amount,
		fee: t.fee,
		meta: t.meta,
		redirect: t.redirect,
		refunded: t.refunded,
		createdAt: t.createdAt
	}));

	//Response
	res.json({
		transactions
	});
};
