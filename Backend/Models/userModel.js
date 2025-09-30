const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        password:{
            type:String,
            required:true
        },
        totalExpenses: {
            type: Number,
            default: 0
        }
    }
);

const user = mongoose.model('user',userSchema)

module.exports = user

