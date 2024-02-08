const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req,res,next ) => {
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.errMessage,
            stack: err.stack    
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}

        error.message = err.message

        //Wrong Mongoose object ID Error
        if(err.name ==='CastError' ){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }


        //Handling Mongoose Validation Error
                if(err.name === 'ValidationError'){
                    const message = Object.values(err.errors).map(value => value.message);
                    error = new ErrorHandler(message, 400)
      }


   //Handling Mongoose  duplicate key error
          if(err.code===11000){
             const message = `Duplicate ${object.keys(err.keyValue)} entered`
             error = new ErrorHandler(message, 400)
          }
          

          //Handling wrong JWT errors
          if(err.name === 'JsonWebTokenError'){
            const message = `JSON web Token is Invalid. Try Again!!!`
            error = new ErrorHandler(message, 400)
    }

     //Handling Expired JWT errors
     if(err.name === 'TokenExpiredError'){
        const message = `JSON web Token is Expired. Try Again!!!`
        error = new ErrorHandler(message, 400)
    }

          res.status(error.statusCode).json({
              success:false,
              error:error.message||"Internal Server Error"
          });
  

        res.status(error.statusCode).json({
            success : false,
            message : err.message || 'Internal Server Error'
        })
    }

}