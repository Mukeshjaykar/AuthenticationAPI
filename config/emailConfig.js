import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  // port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "jaykarmukesh3377@gmail.com", // Admin Gmail Id
    pass: "ctqwrjjxtrfnzgwx", // Admin Gmail Pass
  },
});

export default transporter;
