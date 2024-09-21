const express = require('express');
const {User,Course} = require('../db/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const authMiddleware =require('../middleware/authMiddleware');
const zod = require('zod');

const router = express.Router()

const loginSchema = zod.object({
    username : zod.string().trim(),
    password : zod.string().trim() 
})

router.post('/', async(req, res)=>{
    const body = req.body;

    const { success } = loginSchema.safeParse(body)

    if (!success){
        return res.status(400).json({
            message: "typo error"
        })
    }

    try{
        
        const user = await User.find({
            username: body.username,
        });
        const pass = await bcrypt.compare(body.password,user[0].password);
        
        if (user.length!=0 ){
            const token = jwt.sign(body.username, process.env.jwt_secret);
            res.cookie("token",token);
            res.json({
                message: `Logged In! ${token}`,
                sucess : true
            });
        }
        else{
            res.json({
                message: `user ${body.username} doesn't exist`,
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

router.get('/logout',(req,res)=>{
    res.clearCookie(' token');
    res.json({
        message: 'You are Logged out'
    })
})

router.post('/createCourse', (req,res)=>{
    const { title, discription, price, img } = req.body;

    Course.create({
        title,
        price,
        discription,
        img
    });
    res.send('course created');
})

router.get('/course', async (req,res)=>{
    const courses = await Course.find()
    console.log(courses)
    res.send(courses)
})

router.put('/purchase', authMiddleware ,async (req,res)=>{
    const courseId = req.body.courseId
    const token = req.cookies.token
    const username = jwt.verify(token, process.env.jwt_secret)
    const courses = await Course.find({
        _id: courseId
    })
    if (courses){
        const user = await User.find({
            username :username
        })
        user[0].purchased.push(courses[0]._id)
        await user[0].save();
        res.send(courses);
    }
    else{
        res.json({
            message:"enter the course"
        })
    }
    
})

router.get('/purchasedCourse',authMiddleware, async (req,res)=>{
    const token = req.cookies.token;
    const username = jwt.verify(token, process.env.jwt_secret);
    const user = await User.findOne({
        username:username
    })
    const purchasedCourse = [];
    console.log(user.purchased.length);
    
    for (let index = 0; index < user.purchased.length; index++) {
        const course = await Course.findOne({
            _id: user.purchased[index]
        });
        purchasedCourse.push(course);
        
    }
    res.json({
        message: purchasedCourse
    });
})

router.get('/userdetail',authMiddleware, async(req,res) =>  {
    const token = req.cookies.token
    const username = jwt.verify(token, process.env.jwt_secret) ;

    const user = await User.findOne({
        username: username
    })
    res.json({
        message: user
    })
})
// router.get('/auth', (req,res)=>{
//     const token = req.cookies.token;
//     const user = jwt.decode(token, process.env.jwt_secret)
//     if (token){
//         res.json({
//             user: user,
//             auth: true
//         })
//     }
//     else{
//         res.json({auth: false})
//     }
// })


module.exports = router