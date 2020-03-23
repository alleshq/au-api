const db = require("../util/db");

module.exports = async (req, res, next) => {
	//Get Credentials
	const authHeader = req.headers.authorization;
	var accountCredentials;
	if (typeof authHeader === "string") {
		var credentialsString;
		if (authHeader.split(" ").length !== 2 || !authHeader.startsWith("Basic "))
			return res.status(401).json({err: "badAuthorization"});
		try {
			credentialsString = Buffer.from(authHeader.split(" ")[1], "base64")
				.toString()
				.split(":");
		} catch (err) {
			return res.status(401).json({err: "badAuthorization"});
		}
		if (credentialsString.length !== 2)
			return res.status(401).json({err: "badAuthorization"});

		accountCredentials = {
			id: credentialsString[0],
			secret: credentialsString[1]
		};
	} else return res.status(401).json({err: "badAuthorization"});

	//Get Account
	const account = await db.AuAccount.findOne({
		where: {
			id: accountCredentials.id
		}
	});
	if (!account)
		return res.status(401).json({err: "badAuthorization"});
	if (account.secret !== accountCredentials.secret)
		return res.status(401).json({err: "badAuthorization"});
	req.account = account;
	next();
};
