const CustomError = require('../errors')

const checkPermissions = (reqUser,resourceUserID)=>{

  const requestUserID = reqUser.userID
  const requestUserRole = reqUser.role

  if( requestUserRole === 'admin' || requestUserID === resourceUserID){
    return ;
  }

  throw new CustomError.ForbiddenRequestError('Request forbidden !!!')

}

module.exports = checkPermissions