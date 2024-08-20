import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, message, subject } = req.body;

  // Spécifier les options SMTP avec le type SMTPTransport.Options
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "emelia.shanahan@ethereal.email",
      pass: "FcC2rVKkKCVzvqVkr1",
    },
  } as SMTPTransport.Options);

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });

    res.status(200).json({ status: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error sending email", error });
  }
}
