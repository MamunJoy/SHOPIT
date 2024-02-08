const mongoose = require('mongoose');
const validator = require ('valodator');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto') 

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
        minlength:[6, 'Your password must be longer then 6 characters'],
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

// Encrypting password before saving schema
userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        next()
        }
        
        this.password= await bcrypt.hash(this.password,10)
})

//Compare User Password
userSchema.methods.comparePasswords = async function(enteredPassword){
     return await bcrypt.compare(enteredPassword, this.password)
}
// Return JWT token 

userSchema.methods.getJwtToken = function() {

    return jwt.sign({  id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//Generate password reset token 
userSchema.methods.generateResetToken = function () {
    // Generate a token that we will use to validate this particular request to reset the password
    const resetToken = crypto.randomBytes(20).toString('hex');
  
    // Hash and Set the resetPasswordToken
    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
      
    // Expire in 30 minutes
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  
    return resetToken;
};

module.exports =mongoose.model("User", userSchema);