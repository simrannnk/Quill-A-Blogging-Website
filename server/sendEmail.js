import nodemailer from 'nodemailer';

let userOtp = {} ;
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
      user: 'ksimran1720@gmail.com',
      pass: 'btsuoxmrmrqnkjed'
  }
});

export const sendWelcomeMail = async (emailId, username) =>  {
  const info = await transporter.sendMail({
    from: 'ksimran1720@gmail.com',
    to: emailId, 
    subject: `Hi ${username} ! Welcome to Quill`, 
    // text: `Thanks for joining us. We are thrilled to have you as a part of our community.  Speak your MInd, Reach the World`, // plain text body
    html: `<div>Thanks for joining us. We are thrilled to have you as a part of our community. <div style="margin-top: 30px;font-style:"italic"; " >Speak your Mind, Reach the World</div></div>`, 
  });
}


export const sendOtpMail = async (emailId, genratedOtp) => {
  // storeOtp(emailId);
  const info = await transporter.sendMail({
    from: 'ksimran1720@gmail.com',
    to: emailId, 
    subject: `Your OTP for Quill`, 
    // text: `Thanks for joining us. We are thrilled to have you as a part of our community.  Speak your MInd, Reach the World`, // plain text body
    html: `<div>Your One-Time Password (OTP) is  ${genratedOtp} <div style="margin-top: 30px;font-style:"italic"; " >This code is valid only for 1 minute. If you did not request this please ignore this email. </div></div>`, 
  });
  return info;
}