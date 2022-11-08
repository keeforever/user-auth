const {StatusCodes} = require("http-status-codes")

class UnauthorizedRequestError extends Error{
  constructor(message,error){
    super(message)
    this.status = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthorizedRequestError