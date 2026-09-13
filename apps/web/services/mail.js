import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email, code) {
  await transporter.sendMail({
    from: `"Gosra" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your Gosra account",
    text: `Your Gosra verfication code is : ${code}. This code expires in 10 minutes`,
  });
}
