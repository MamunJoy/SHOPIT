const mongoose = require('mongoose');
const validator = require ('valodator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please provide your name'],
        maxlength:[30,"Name can't be more than 30 characters"]
    },
    email:{
        type:String,
        unique: true,
        required: [true,'Please provide your email'],
        validator: [validator.isEmail, 'Please provide your email address']
    },
    password:{
        type:String,
        required: [true,'Please provide a password'],
        minLength:[6, 'Your password must be longer then 6 characters'],
        select:false
        },
        avatar: {
            public_id: {
                type:String,
                required: true
            }
        },
        role:{
            type:String,
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        resetPasswordToken: String,
        resetPasswordExpire:Date

})

module.expordefault