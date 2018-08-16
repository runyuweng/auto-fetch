const nodemailer = require('nodemailer');
const { user, pass } = require('./config')

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  service: "Outlook365",
  port: 587,
  secureConnection: true,
  auth: {
    user,
    pass
  }
});

function sendMail(info) {

  const mailOptions = {
    from: 'LA_GOU',
    to: 'runyuweng@163.com',
    subject: '来自美团云',
    html: `<b>${info}</b>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

module.exports = sendMail