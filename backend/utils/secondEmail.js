const nodemailer = require('nodemailer');

const  sendEmail = async options => {
    const transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: { 
            user: process.env.SMTP_EMAIL, // generated ethereal email
            pass: process.env.SMTP_PASSWORD // generated ethereal password
        }
    });

    const message = {
        from: `${process.SMTP_FROM_NAME} <${process.env.SMTP_FROM}>`,
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text:  options.message // plain text body
    }

    await transporter.sendMail(message)

}

module.exports = sendEmail;