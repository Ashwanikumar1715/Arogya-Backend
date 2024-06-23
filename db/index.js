const mongoose = require("mongoose")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')

dotenv.config()

mongoose.connect(process.env.Database_URL);

// Schema 

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    dob : {
        type : Date,
        required: true,
    },
    username : {
        type: String,
        required: true,
        unique: true,
        minLength : 3,
        maxLength: 20
    },
    password : {
        type: String,
        required: true,
        minLength: 6,
        maxLength:30
    },
    phoneNo : {
        type :String,
        required: true,
    },
    watchlist :  [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'course',
    }],
    purchased : [ {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'course',
    } ]
})



userSchema.pre("save", async function(next){
    const hashed_pass = await bcrypt.hash(this.password , 10);
    this.password = hashed_pass;
    next();
})

// const courseSchema = new mongoose.Schema({
//     title : String,
//     price : Number,
//     description: String,
//     img_url: String-
// })

// const course = mongoose.model("Course", courseSchema);
const user = mongoose.model("User" , userSchema)

module.exports = user

