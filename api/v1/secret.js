const config = require("../../config");
const randomString = require("randomstring").generate;

module.exports = async (req, res) => {
    const secret = randomString(config.secretLength);
    await req.account.update({secret});
    res.json({secret});
};