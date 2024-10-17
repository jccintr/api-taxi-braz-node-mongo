import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async(to,code) => {

  const subject = "Código de verificação Braz Driver";
  const body = `Por favor, informe o seguinte código ${code} para verificar o seu e-mail e começar a usar os nossos serviços.\nEsta é uma mensagem automática, não é necessário respondê-la.\n\nAtenciosamente\n\nEquipe Braz Driver`;

  const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: to,
    subject: subject,
    text: body,
  };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

}

// export const sendEmail = async(subject,to,body) => {

//      // console.log('email enviado para ' + to);
//      const transporter = nodemailer.createTransport({
//         pool: true,
//         host: process.env.SMTP_HOST,
//         port: 465,
//         secure: true, // use TLS
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASSWORD,
//         },
//       });
      
    
//       // Email data
//     const mailOptions = {
//         from: process.env.SMTP_USER,
//         to: "jccintr@gmail.com",
//         subject: "Node.js Email Tutorial",
//         text: "This is a basic email sent from Node.js using Nodemailer.",
//       };
      
//       // Send the email
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Error sending email:', error);
//         } else {
//           console.log('Email sent:', info.response);
//         }
//       });
// }

export const sendResetPasswordEmail = async(to,code) => {

  const subject = "Redefinição de senha Braz Driver";
  const body = `Por favor, informe o seguinte código ${code} para resetar a sua senha de acesso.\nEsta é uma mensagem automática, não é necessário respondê-la.\n\nAtenciosamente\n\nEquipe Braz Driver`;

  const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: to,
    subject: subject,
    text: body,
  };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

}