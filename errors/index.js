const BadRequestError = require('./bad-request')
const UnauthorizedRequestError = require('./unauthorized-request')
const ForbiddenRequestError = require('./forbidden-request')

module.exports = {
  BadRequestError,
  UnauthorizedRequestError,
  ForbiddenRequestError
}