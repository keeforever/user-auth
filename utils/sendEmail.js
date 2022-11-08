const nodemailerConfig = require("./nodemailerConfig")
const nodemailer = require("nodemailer")

const sendEmail = async ({to,subject,html}) => {
  const transporter = nodemailer.createTransport(nodemailerConfig)

  const email = await transporter.sendMail({
    from : '"kaliyamoorthy" <kaliyamoorthy.2k@gmail.com>',
    to,
    subject,
    html
  })
};

module.exports = sendEmail;
