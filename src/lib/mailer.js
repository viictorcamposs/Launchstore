const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6401a4c71319cd",
        pass: "3355b57ff462bd"
    }
});