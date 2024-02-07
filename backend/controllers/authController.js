const user = require ('../models/user');


const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require ('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwtToken');


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