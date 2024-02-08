const User = require('../models/user')

const jwt = require("./catchAsyncErrors");
const ErrorHandler = require ("./utils/errorHandler");
const catchAsyncErrors = require('./catchAsyncErrors');



// checks  if user is logged in or not. If not, it redirects to login page
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies

    if(!token){
        return  next(new ErrorHandler('Login first to acces the resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()

})

// Handling users roles
exports.authorizeRoles = (...roles)=>{
     return (req,res,next)=> {
         if (!roles.includes(req.user.role)){
            return next(new ErrorHandler(` Role (${req.user.role}) is not allowed this resource`, 403))
         }
         next()
     } 
}


// Checks whether a user has created any recipe or not