import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, code, subject } = req.body;

  // Spécifier les options SMTP avec le type SMTPTransport.Options
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  } as SMTPTransport.Options);

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Réinitialisation du mot de passe RentAuto</title>
            <style>
              /* Couleurs */
              body {
                background-color: #f8f9fa;
                color: #333;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
        
              h1 {
                color: #2196f3; /* Bleu marine */
                font-size: 28px;
                margin-bottom: 20px;
                text-align: center;
              }
        
              .container {
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              }
        
              p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 15px;
              }
        
              .code {
                background-color: #e0f2f5;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
                font-size: 20px;
                text-align: center;
              }
        
              .button {
                background-color: #2196f3;
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                display: inline-block;
                margin-top: 20px;
              }
        
              .button:hover {
                background-color: #1976d2;
              }
        
              /* Responsive */
              @media (max-width: 768px) {
                .container {
                  width: 95%;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Biblio - Réinitialisation du mot de passe</h1>
        
              <p>Cher utilisateur,</p>
        
              <p>
                Vous avez récemment demandé une réinitialisation de votre mot de passe. <br />Veuillez trouver ci-dessous votre code secret temporaire
                pour réinitialiser votre mot de passe.
              </p>
        
              <p class="code">${code}</p>
        
              <p>Cordialement,</p>
        
              <p>L'équipe de biblio</p>
            </div>
          </body>
        </html>      
      `,
    });

    res.status(200).json({ status: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error sending email" + "\n" + error });
  }
}
