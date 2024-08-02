import nodemailer from "nodemailer";

// export async function sendEmail(to,subject,userName='', token){
  export async function sendEmail(to,subject,templateFunction, templateData){

    const transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            user: process.env.EMAILSENDER,
            pass: process.env.EMAILPASSWORD,
        },
      });

      const htmlContent = templateFunction(templateData);

      const info = await transporter.sendMail({
        from: `SkillUP HUB" <${process.env.EMAILSENDER}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html:htmlContent, // html body
      });

      return info;

}


