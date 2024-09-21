const express = require("express")
const {User} = require("../db/index")
const zod = require("zod")

const router = express.Router()

const signUpSchema = zod.object({
    name: zod.string(),
    username: zod.string(),
    password: zod.string() 
}) 

router.post('/', async(req , res) => {
    const body = req.body

    const result = signUpSchema.safeParse(body)

    if (!result.success){
        return res.status(400).send("Typo Error")
    }

    const x = await User.find({username:body.username})
    try
    {
        if(x.length!=0){
            return res.json({
                message: 'user already exist',
                response: `${x}`
            })
        }
        await User.create(body)
        
        res.json({
            message : `Hii ${body.name} you are live`
        });
    }
    catch{
        res.json({
            error:'error hogya ji'
        });
    }
})
 
module.exports = router