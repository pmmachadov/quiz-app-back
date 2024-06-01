const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.QUIZZ_APP_EMAIL,
    pass: process.env.QUIZZ_APP_EMAIL_PASSWORD,
  },
});

module.exports = transporter;
