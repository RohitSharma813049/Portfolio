import nodemailer from "nodemailer";

export async function sendNotificationMail(to: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Gmail,
        pass: process.env.Gmail_Password,
      },
    });

    const mailOptions = {
      from: `"Global Scholar Publications" <${process.env.Gmail}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
