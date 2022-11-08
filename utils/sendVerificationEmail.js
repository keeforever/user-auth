const sendEmail = require('./sendEmail')

const sendVerificationEmail = ({to,verificationToken,email,origin})=>{
  const subject = 'Email Verification.'
  const href = `http://localhost:5000/email-verification?verificationToken=${verificationToken}&email=${email}`
  const html = `<h3>Click to verify the Email : <a href=${href}>Verification link</a></h3>`
  return sendEmail({to,subject,html})
}

module.exports = sendVerificationEmail