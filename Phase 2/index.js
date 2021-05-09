const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
// const dotenv = require('dotenv');
// dotenv.config()

// console.log(process.env.EMAIL);
// console.log(process.env.PASSWORD);
link="https://selfregistration.cowin.gov.in/"
function main() {
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: "vaccineundo",
            pass: "vaccine@undo.com"
        }
    }));
    let mailOptions = {
        from: "vaccineundo@gmail.com", // sender address
        to: "sumansb13432@gmail.com", // list of receivers
        subject: "Vaccine is available in your area", // Subject line
        html: "Hello,<br> Please Click on the link to book your slot.<br><a href=" + link + ">CoWin</a><br>", // plain text body
        // html: "<b>Hello world?</b>", // html body
    }
    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            console.log(err);
        else
            console.log('Email sent: ' + info.response);
    });
}

main();