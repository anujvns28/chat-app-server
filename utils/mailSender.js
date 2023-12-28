const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (email, title, body) => {
    try {
        console.log("calling sedmail")
        const transpoter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        const info = await transpoter.sendMail({
            from: `${'Anuj yadav  '}`,
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        return info

    } catch (err) {
        console.log(err, "err occured in email sending")
    }
}

module.exports = sendMail;