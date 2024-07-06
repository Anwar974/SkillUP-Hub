import nodemailer from "nodemailer";

export async function sendEmail(to,subject,html){

    const transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: process.env.EMAILSENDER,
            pass: process.env.EMAILPASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: '"SkillUP HUB" <process.env.EMAILSENDER>', // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
      });

      return info;

}