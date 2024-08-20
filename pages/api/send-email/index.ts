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
    host: process.env.MAILER_SERVICE,
    port: parseInt(process.env.MAILER_PORT || "587"), // Convertir la chaîne en nombre
    auth: {
      user: process.env.MAILER_LOGIN,
      pass: process.env.MAILER_PASSWORD,
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
