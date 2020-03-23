module.exports = async (req, res) => {
    res.json({
        id: req.account.id
    });
};