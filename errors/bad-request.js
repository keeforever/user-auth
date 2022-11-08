const {StatusCodes} = require("http-status-codes")

class BadRequestError extends Error{
  constructor(message){
    super(message)
    this.status = StatusCodes.BAD_REQUEST
  }
}

module.exports = BadRequestError