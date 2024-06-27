const express  = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/parent");
const cookieParser = require("cookie-parser");
const cors = require('cors')

const app = express()

app.use(cors({
    origin:'http://localhost:5173', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/user', router);

app.post('/',(req,res)=>{
    // res.send(`Your age is ${req.params.id}`)
    const name = req.body.name;
    const branch = req.body.branch;
    res.json({
        message : `I am ${name} from ${branch} branch`
    })
})

app.listen(8000)