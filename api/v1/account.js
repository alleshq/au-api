const formatAu = require("../../util/formatAu");

module.exports = async (req, res) => {
    const user = await req.account.getUser();
    const team = await req.account.getTeam();

    res.json({
        id: req.account.id,
        secret: req.account.secret,
        name: req.account.name,
        balance: req.account.balance,
        formattedBalance: formatAu(req.account.balance),
        createdAt: req.account.createdAt,
        user: user ? {
            id: user.id,
            username: user.username,
            name: user.name,
            nickname: user.nickname,
            plus: user.plus
        } : null,
        team: team ? {
            id: team.id,
            slug: team.slug,
            name: team.name,
            plan: team.plan
        } : null
    });
};