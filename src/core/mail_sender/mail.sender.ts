const nodemailer = require("nodemailer");
require("dotenv").config();

export async function sendMail(
  recipients: String[],
  message: String
): Promise<void> {
  // settings
  const options = {
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
    logger: true,
  };

  try {
    let transporter = await nodemailer.createTransport(options);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: recipients,
      subject: `Backup podatkovne baze`,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error occurred when sending an email.", error);
    throw new Error("Email could not be sent."); // Throw custom error
  }
}
