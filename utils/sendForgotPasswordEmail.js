const sendEmail = require('./sendEmail')

const sendForgotPasswordEmail = ({to,verificationToken,email,origin})=>{
  const subject = 'Password Reset.'
  const href = `http://localhost:5000/email-verification?verificationToken=${verificationToken}&email=${email}`
  const html = `<h1>Click by reset password: </h1><a href=${href}>Verification link</a>`
  return sendEmail({to,subject,html})
}

module.exports = sendForgotPasswordEmail