const express = require('express');
const {User,Course} = require('../db/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authMiddleware =require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', async(req, res)=>{
    const {username,password} = req.body;
    try{
        console.log(username);
        const user = await User.find({
            username: username,
        });
        console.log(user);
        const pass = await bcrypt.compare(password,user[0].password);
        console.log(pass);
        
        if (user.length!=0 ){
            const token = jwt.sign(username, process.env.jwt_secret);
            res.cookie("token", token)
            res.json({
                message: "Logged In!",
                sucess : true
            });
        }
        else{
            res.json({
                message: `user ${username} doesn't exist`,
                sucess : false
            })
        }
    }
    catch{
        res.json({
            message:"invalid credential",
            sucess: false
        })
    }
})

router.post('/logout',(req,res)=>{
    res.cookie('token','')
    res.json({
        message: 'You are Logged out'
    })
})

router.post('/course', (req,res)=>{
    const { title, discription, price, img } = req.body

    Course.create({
        title,
        price,
        discription,
        img
    })
    res.send('course created')
})

router.put('/purchase', authMiddleware, async (req,res)=>{
    const title = req.body.title
    const token = req.cookies.token
    const username = jwt.verify(token, process.env.jwt_secret)
    const courses = await Course.find({
        title: title
    })
    if (courses){
        const user = await User.find({
            username :username
        })
        user[0].purchased.push(courses[0]._id)
        await user[0].save()
        console.log(user);
        res.send(courses);
    }
    else{
        res.json({
            message:"enter the course"
        })
    }
    
})

router.put('/userdetail',authMiddleware, async(req,res) =>  {
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