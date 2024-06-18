const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.QUIZZ_APP_EMAIL,
        pass: process.env.QUIZZ_APP_EMAIL_PASSWORD,
    },
});

module.exports = {
    sendConfirmationEmail: async (email, token) => {
        const url = `${process.env.CLIENT_URL}/confirm/${token}`;

        await transporter.sendMail({
            to: email,
            subject: 'Confirm your email address',
            html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
        });
    },
};
