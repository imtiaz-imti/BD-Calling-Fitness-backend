class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor)
    }
    setCode(code){  
      this.code = code 
      return this 
    }
}
module.exports = ErrorHandler