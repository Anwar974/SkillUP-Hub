export const welcomeEmailTemplate = ({ userName, token }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                box-sizing: border-box;
            }
            .header {
                background-color: #4640DE;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                font-size: 26px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
                text-align: center;
                line-height: 1.5;
            }
            .content h1 {
                color: #333;
                font-size: 24px;
                margin-bottom: 15px;
            }
            .content p {
                color: #555;
                font-size: 16px;
                margin-bottom: 20px;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: 600;
                color: #ffffff !important;
                background-color: #4640DE; 
                border-radius: 5px;
                text-decoration: none;
                margin: 10px 0;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #218838; /* Darker shade on hover */
            }
            .footer {
                text-align: center;
                padding: 15px;
                color: #777;
                font-size: 14px;
                border-top: 1px solid #e0e0e0;
                margin-top: 20px;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Welcome to Our Service
            </div>
            <div class="content">
                <p>Welcome to SkillUP HUB, ${userName}!</p>
                <img src="https://res.cloudinary.com/dh37z23kg/image/upload/v1721811232/Skill%20UP/images/20944101_tyfa7b.jpg" alt="Welcome Image" style="max-width: 100%; height: auto; border: 0;">

<p>We’re excited to have you with us. Confirm your email by clicking the button below:</p>
                <a href='https://graduation-project-umber.vercel.app/auth/confirmEmail/${token}' class='button'>Confirm Email</a>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Our Service. All rights reserved. <br>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const sendCodeTemplate =( {userName,code}) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                box-sizing: border-box;
            }
            .header {
                background-color: #4640DE;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                font-size: 26px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
                text-align: center;
                line-height: 1.5;
            }
            .content h1 {
                color: #333;
                font-size: 24px;
                margin-bottom: 15px;
            }
            .content p {
                color: #555;
                font-size: 16px;
                margin-bottom: 20px;
            }
            .code {
                display: inline-block;
                padding: 12px 24px;
                font-size: 20px;
                font-weight: 600;
                color: #ffffff;
                background-color: #4640DE;
                border-radius: 5px;
                margin: 10px 0;
            }
            .footer {
                text-align: center;
                padding: 15px;
                color: #777;
                font-size: 14px;
                border-top: 1px solid #e0e0e0;
                margin-top: 20px;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Password Reset
            </div>
            <div class="content">
                <h1>Hello, ${userName}! </h1>
                <p>We received a request to reset your password. Please use the code below to reset your password:</p>
                <div class="code">${code}</div>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SkillUP HUB. All rights reserved. <br>
            </div>
        </div>
    </body>
    </html>
    `;
}

export const statusChangeEmailTemplate = ({ userName, newStatus, programTitle,message }) => {

    if(newStatus==='Accepted'){
        return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;
      border-radius: 8px;  color: #333;">
        <h2 style="color: #4640DE;">Hello ${userName},</h2>
        <p style="font-size: 16px;">We wanted to inform you that your application for the program <strong>"${programTitle}"</strong> has been <span style="color: #4CAF50; font-weight: bold;">${newStatus}</span>.</p>
        ${
            message
                ? `<p style="font-size: 16px; color: #333;"><strong>Message from your instructor:</strong><br>${message}</p>`
                : ''
        }
       <p style="font-size: 14px;">If you have any questions or need further assistance, contact with your instructor.</p>
        <p style="font-size: 14px; margin-top: 20px;">Thank you,<br><strong>SkillUP HUB Admin</strong></p>
         <img src="https://res.cloudinary.com/dh37z23kg/image/upload/v1735402002/Skill%20UP/images/4155938_ovrqar.jpg"
          alt="Accepted status image" style="max-width: 500px; height: auto; border: 0;">
        
    </div>
    `;
    }else if(newStatus==='Rejected'){
        return `

        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px;
        border: 1px solid #4640DE; border-radius: 8px; color: #333;">
        <h2 style="color: #4640DE;">Hello ${userName},</h2>
        <p style="font-size: 16px;">Thank you for applying to the <strong>${programTitle}</strong> program.
        After careful consideration, we regret to inform you that your application was not successful at this time.</p>
        ${
            message
                ? `<p style="font-size: 16px; color: #333;"><strong>Message from your instructor:</strong><br>${message}</p>`
                : '<p style="font-size: 16px;">We encourage you to reapply in the future or explore resources to support your goals.</p>'
        }
        <p style="font-size: 14px; margin-top: 20px;">Thank you,<br><strong>SkillUP HUB Admin</strong></p>
        </div>
        `;

    }
    
};

export const enrollmentStatusChangeEmailTemplate = ({ userName, newEnrollmentStatus, programTitle,message }) => {
    let statusMessage;

    // Customize message based on enrollment status
    switch (newEnrollmentStatus) {
        case 'Enrolled':
            statusMessage = `Congratulations! You have been successfully <span color: #4640DE;">enrolled</span> in the "${programTitle}" program.`;
            break;
        case 'Passed':
            statusMessage = `We are pleased to inform you that you have successfully 
            <span color: #4CAF50;">passed</span> the requirements for the "${programTitle}" program.`;
            break;
        case 'Failed':
            statusMessage = `Unfortunately, you did not meet the requirements for the "${programTitle}" program.
             We encourage you to review the program guidelines and apply again in the future.`;
            break;
        case 'Off Track':
            statusMessage = `Your progress in the "${programTitle}" program is currently off track. 
            Please contact us to discuss next steps and explore ways to get back on course.`;
            break;
        default:
            statusMessage = `Your enrollment status has been updated.`;
    }

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #4640DE; border-radius: 8px; color: #333;">
        <h2 style="color: #4640DE;">Hello ${userName},</h2>
        <p style="font-size: 16px;">${statusMessage}</p>
         ${
            message
                ? `<p style="font-size: 16px; color: #333;"><strong>Message from your instructor:</strong><br>${message}</p>`
                : ''
        }
        <p style="font-size: 16px;">If you have any questions or need further clarification, contact your instructor.</p>
        <p style="font-size: 14px; margin-top: 20px;">Best regards,<br><strong>SkillUP HUB Team</strong></p>
    </div>
    `;
};

export const reactivationEmailTemplate = ({ userName, token }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>    
        <style>
        body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                box-sizing: border-box;
            }
        .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: 600;
                color: #ffffff !important;
                background-color: #4640DE; 
                border-radius: 5px;
                text-decoration: none;
                margin: 10px 0;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #218838; /* Darker shade on hover */
            }
        </style>
    </head>
    <body>
    <div class="container" >

     <h1>Hello ${userName},</h1>
      <p>It looks like your account is currently deactivated. To reactivate your account, please click the link below:</p>
      <a href="https://graduation-project-umber.vercel.app/auth/reactivate/${token}" class='button'>Reactivate My Account</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you!</p>

    </div>
     
    </body>
    `;
  };