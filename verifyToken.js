const jwt = require('jsonwebtoken')
module.exports = (req,res,next)=>{
    const token = req.header('Authorization');
    if (!token)
        res.send("No token found in the header");
    try {
        jwt.verify(token,"privatekey");
        next();
    } catch (error) {
        res.send("Invalid Token");
    }
}