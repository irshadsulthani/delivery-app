import nodemailer from 'nodemailer';
import { config } from '../../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.pass_email,
    pass: config.pass_key,
  },
});
console.log('hy its here coming in nodmailer')

export const sendOtpMail = async (to: string, otp: number) => {
  const mailOptions = {
    from: config.pass_email,
    to,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: ${otp}</h2><p>This OTP will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
