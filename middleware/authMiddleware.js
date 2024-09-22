const jwt = require('jsonwebtoken');
const { User } = require('../db');

const authMiddleware = async(req,res,next) => {
    try{
        const token=req.cookies.jwtoken;
        console.log("tokennnn", token);
        const verifytoken=jwt.verify(token,'hsadjakh');
        console.log("verifytoken", verifytoken)
        const userId = verifytoken._id; // Extract the user ID
        const user = await User.findOne({ _id: userId });

        console.log("userrrr", user)

        if(!user) {
            throw new Error("user not found");
        }

        req.token=token;
        req.user=user;
        req.userId=user._id;

        next();
       
    }
    catch{
        res.status(403).json({
            message: 'please Login'
        });
    }
    
}

module.exports = authMiddleware