const user = require ('../models/user');


const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require ('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');


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