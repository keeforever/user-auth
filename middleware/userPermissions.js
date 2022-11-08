const CustomError = require("../errors");

const userPermissions = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      throw new CustomError.ForbiddenRequestError('Request forbidden')
    }
    next()
  }
}

module.exports = userPermissions;
