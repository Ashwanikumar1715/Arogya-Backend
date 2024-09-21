const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) => {
    try{
        const token = req.cookies.token;
        if (!token){
            return res.send('token not found')
        }
        const username = jwt.verify(token, process.env.jwt_secret);
        if(username){
            next()
        }
        else{
            res.status(404).send("please login");
        }
    }
    catch{
        res.status(403).json({
            message: 'please Login'
        });
    }
    
}

module.exports = authMiddleware