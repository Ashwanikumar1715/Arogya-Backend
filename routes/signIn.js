const express = require('express');
const User = require('../db/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

router.get('/', async(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username: username,
    })

    const pass = await bcrypt.compare(password,user[0].password);
    console.log(pass);
    
    if (user.length!=0 & pass){
        const token = jwt.sign(username, process.env.jwt_secret)
        res.json({
            token : token
        })
    }
    else{
        res.json({
            message: `user ${username} doesn't exist`
        })
    }
    // res.json({
    //     message: user
    // })
})

module.exports = router