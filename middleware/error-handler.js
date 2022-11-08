const {StatusCodes} = require("http-status-codes")

const errorHandler = (err,req,res,next)=>{
  const customError = {
    msg : err.message || 'Something went to wrong Please try again later !!!',
    status : err.status || StatusCodes.INTERNAL_SERVER_ERROR
  }

  if(err.name === "ValidationError"){
    const message = Object.values(err.errors).map(({message})=>message).join(' ')
    customError.msg = message
    customError.status = StatusCodes.BAD_REQUEST
  }

  if(err.code === 11000){
    const message = "This is registered Email. Please login with password."
    customError.msg = message
    customError.status = StatusCodes.BAD_REQUEST
  }

  if(err.name === 'CastError'){
    const message = "Invalid user id"
    customError.msg = message
    customError.status = StatusCodes.BAD_REQUEST
  }
  res.status(customError.status).json({msg:customError.msg})
  // res.status(customError.status).json({msg:err})
}

module.exports = errorHandler