const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// DotEnv
const dotenv = require('dotenv');
dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, SECRET_TOKEN);
		const userId = await decodedToken.userId;
		req.auth = {
			userId: userId
		};
		next();
	} catch (err) {
		res.status(401).json({ error: "No token" });
	}
};