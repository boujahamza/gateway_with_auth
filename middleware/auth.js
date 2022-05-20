//Middleware for validating incoming token (does not check for role!)
//THe token must be provided in the "x-access-token" header of the request
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    
    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch(err){
        console.log(err)
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = verifyToken;