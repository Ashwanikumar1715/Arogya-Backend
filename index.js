const express  = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/parent");
const app = express()

app.use(bodyParser.json())
app.use('/user', router)

app.post('/',(req,res)=>{
    // res.send(`Your age is ${req.params.id}`)
    const name = req.body.name;
    const branch = req.body.branch;
    res.json({
        message : `I am ${name} from ${branch} branch`
    })
})

app.listen(8000)