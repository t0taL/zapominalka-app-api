const nodemailer = require('nodemailer');

class EmailSender {
  static get transporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    })
  }

  constructor() {
  }

  static async send(content) {
    await EmailSender.transporter.sendMail(content);
  }
}

module.exports = EmailSender;
