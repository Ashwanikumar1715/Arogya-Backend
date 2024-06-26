const jwt = require('jsonwebtoken')

function  authMiddleware(req,res,next){
    try{
        const token = req.cookies.token;
        const username = jwt.verify(token, process.env.jwt_secret)
        if(username){
            next()
        }
        else{
            res.status(403).send("please login")
        }
    }
    catch{
        res.status(403).json({
            message: 'please Login'
        })
    }
    
}

module.exports = authMiddleware