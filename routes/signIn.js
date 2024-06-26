const express = require('express');
const User = require('../db/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authMiddleware =require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', async(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const user = await User.find({
            username: username,
        })
        const pass = await bcrypt.compare(password,user[0].password);
        console.log(pass);
        
        if (user.length!=0 & pass){
            const token = jwt.sign(username, process.env.jwt_secret)
            res.cookie("token", token)
            res.json({
                message: "Logged In!"
            })
        }
        else{
            res.json({
                message: `user ${username} doesn't exist`
            })
        }
    }
    catch{
        res.send("invalid credential")
    }
    // res.json({
    //     message: user
    // })
})

router.post('/logout',(req,res)=>{
    res.cookie('token','')
    res.json({
        message: 'You are Logged out'
    })
})



router.put('/purchased',authMiddleware, async(req,res) =>  {
    const token = req.cookies.token
    const username = jwt.verify(token, process.env.jwt_secret)

    const user = await User.findOne({
        username: username
    })
    res.json({
        message: user
    })
})

module.exports = router