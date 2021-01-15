const bcrypt = require('bcryptjs');
const uniqueCode = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000
}
const hashPassword = (password) => {
    return bcrypt.hash(password, 10);
}
const sendEmail = (data) => {
    const mailgun = require('mailgun-js');
    const mg = mailgun({ apiKey: process.env.MAIL_KEY, domain: process.env.MAIL_DOMAIN });
    mg.messages().send(data, (error, body) => {
        console.log(body)
    });
}
module.exports = { uniqueCode, hashPassword,sendEmail }