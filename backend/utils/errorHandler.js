//Error Handler class
class ErrorHandler extends Error{
constructor(message, errorCode) {
    super(message);
    this.statusCode = this.statusCode

    Error.captureStackTrace(this, this.costructor)
    }

}

module.exports = ErrorHandler;