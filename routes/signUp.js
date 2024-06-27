const express = require("express")
const {User} = require("../db/index")

const router = express.Router()

router.post('/', async(req , res) => {
    const name =  req.body.name;
    const dob =  req.body.dob;
    const username =  req.body.username;
    const password =  req.body.password;
    const phoneNo =  req.body.phoneNo;

    const x = await User.find({username:username})
    try
    {
        let response;
        if(x.length!=0){
            response = {
                message: 'user already exist'
            }
        }
        else{
            User.create({
                name : name,
                dob : dob,
                username : username,
                password : password,
                phoneNo: phoneNo
            })
            response = {
                message : `Hii ${name} you are live`
            }
        }
        res.send(response);
    }
    catch{
        res.json({
            error:'error hogya ji'
        });
    }
})
 
module.exports = router