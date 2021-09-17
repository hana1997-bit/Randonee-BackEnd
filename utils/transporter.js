const nodemailer = require("nodemailer");

const Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: process.env.MAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
    }
});
module.exports=Transporter;