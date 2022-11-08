const {StatusCodes} = require("http-status-codes")

class ForbiddenRequestError extends Error{
  constructor(message){
    super(message)
    this.status = StatusCodes.FORBIDDEN
  }
}

module.exports = ForbiddenRequestError