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