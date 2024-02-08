const user = require ('../models/user');


const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require ('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto =  require('crypto')


//register a User   => /api/v1/register
exports.registerUser= catchAsyncError(async (req, res, next) => {

    const { name,email,password } = req.body;


const User = await user.create({
    name, 
    email, 
    password,
    avatar: {
        public_id: 'no-image',
        url:'https://res.cloudinary.com/dq6zclwjf/image/upload/v1589'
            }
       })

    sendToken(user, 200, res)

 })


 //Login User => /a[i/v1/login
exports.loginUser = catchAsyncErrors(  async (req, res, next)=> {
     const { email, password } = req.body;

//check if email and password is entered by user

if (!email || !password){
    return next(new ErrorHandler('Please enter email & password' , 400))
    }

    //Finding User  in the database
    const user =  await User.findOne ({ email }).select('+password')

    if(!user) {
        return next( new ErrorHandler ('Invalid Email or Password ', 401));
    }  
    
    //checks if password is correct or not
    const isPasseordMatched = await user.comparePassword(password);

    if (!isPasseordMatched) {
        return next(new ErrorHandler("Invalid Email or Password ", 401));
    }

    sendToken(user, 200, res)
})

// Forgot Password    => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) =>{

    const user = await User.findOne({ email : req.body.email});

    if(!user) {
       return next(new ErrorHandler("Email does not exist with this email", 404));
    }

    //Get reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    //Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resertToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you do not make this request just ignore it.\n`;

    try{

        await sendEmail({
            email: user.email,
            subject: 'ShopIT password  Recovery',
            message: 
        })
        res.status(200).json({
           success: true,
           message: `Email sent to : ${user.email}`
        });
       
    } catch(error) {
        user.getResetPasswordToken = undefined;
        user.getResetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }

   })

   //Reset Password   =>    /api/v1/password/reset/:token
   exports.resetPassword = catchAsyncErrors(async (req, res, next) =>{
  
    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex') 
    
    const user  = await User.findOne({  
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
       })

       if(!user){
         return next( new ErrorHandler("Password reset topic is Invalid or has been Expired ",400)
         )
       }

       if ( req.body.password !== req.body.confirmPassword ){
          return next( new ErrorHandler("Passwords do not match",400));
       }
       //Set New Password and Reset fields
       user.password = req.body.password;
       user.resetPasswordToken=undefined;
       user.resetPasswordExpire=undefined;

       await  user.save();
       sendToken(user ,200,res);
    })


        //get  currently logged in user details
        exports.getUserProfile =  catchAsyncErrors( async (req, res,next)=>{
     
         const user = await user.findById(req.user.Id)

         res.status(200).json({
             success : true,
             user
    })
})


    //Update / Change Password   =>   /api/v1/password/update
    exports.updatePassword =  catchAsyncErrors( async (req, res,next)=>{
     const user = await user.findById(req.user.Id).select('+password')
        
        //check previous password
        const isMatch = await user.comparePassword(req.body.oldPassword)

        if (!isMatch) {
            return next(new ErrorHandler("Old Password is incorrect",400));
        }

        user .password = req.body.password;
        await user.save();

        sendToken(user, 200,res)
    })


    // Update user  profile data =>  /api/v1/me/update 
    exports.updateProfile = catchAsyncErrors(async (req, res, next) =>{
        const  newUserData = {
            name: req.body.name,
            email: req.body.email
        }

        //Update avatar : TODO

        const user = await user.findByIdAndUpdate(req.user.id , newUserData , {
           new:true,
           runValidators: true,
           useFindAndModify:false
       })

       res.status(200).json({
        success: true
       })

    })



        // Logout user    => /api/v1/logout
        exports.logout = catchAsyncErrors(async (req,res,next) => {
        res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true
        
    })

    res.status(200).json({
        success:true,
        message:'Logged out successfully'
    })
})


//Admin Routes


//Get all Users =>    /api/v1/admin/users
exports.AllUsers = catchAsyncErrors(async(req,res, next ) => {
    const users = await User.find()
    res.status(200).json({
        success:true,
        users
    })
})


//Get user details   =>    /api/v1/admin/user/:id

exports.getUserDetails = catchAsyncErrors( async (req , res , next)=> {
    const user = await User.findById(req.params.id);
    
    //Ensure the user exists
    if(!user){
        return next(new ErrorResponse(`No user found with id: ${req.params.id}`))
    }

    //Send the response
    res.status(200).json({
        success : true,
        data : user
    })
})

   // Update user  profile data =>  /api/v1/admin/user/:id
   exports.updateUser = catchAsyncErrors(async (req, res, next) =>{
    const  newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }


    const user = await user.findByIdAndUpdate(req.params.id , newUserData , {
       new:true,
       runValidators: true,
       useFindAndModify:false
   })

   res.status(200).json({
    success: true
   })

})


//Delete User   =>    /api/v1/admin/user/:id

exports.deleteUser = catchAsyncErrors( async (req , res , next)=> {
    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorResponse(`No user found with id: ${req.params.id}`))
    }

    //Remove avatar free cloudinary - TODO

    await user.remove();

    res.status(200).json({
        success : true
    })
})

