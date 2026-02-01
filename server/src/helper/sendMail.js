import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const sendMail = async (sender_email, receiver_email, subject, html) => {
  const info = await transporter.sendMail({
    from: sender_email, // sender address
    to: receiver_email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  });
};

export default sendMail;
