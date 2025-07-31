const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const redisClient = require('../config/redis');

const userMiddelware = async (req, res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not Present");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);

        const {_id} = payload;
        if(!_id)
            throw new Error("Invalid Token");

        const result = await User.findById(_id);

        if(!result)
            throw new Error("User Doesn't Exits");
            

        const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;

        next();
            

    } catch (err) {
        res.status(401).send("Error: "+err)
    }
}


module.exports = userMiddelware;