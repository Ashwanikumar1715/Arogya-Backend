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
        maxLength:300,
    },
    phoneNo : {
        type :String,
        required: true,
    },
    watchlist :  [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'courses',
    }],
    purchased : [ {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'courses',
    } ]
})



userSchema.pre("save", async function(next){
    const hashed_pass = await bcrypt.hash(this.password , 10);
    this.password = hashed_pass;
    next();
})

const courseSchema = new mongoose.Schema({
    title : String,
    price : Number,
    description: String,
    img_url: String
})

const Course = mongoose.model("Course", courseSchema);
const User = mongoose.model("User" , userSchema)

module.exports = {User, Course}

