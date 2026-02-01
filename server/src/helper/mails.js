import sendMail from "./sendMail.js";
import dotenv from "dotenv";
dotenv.config();
const currentYear = new Date().getFullYear();

async function generatedOtpMail(email, fullName, generatedOtp) {
  await sendMail(
    "SkillMatch",
    email,
    "SkillMatch- OTP Verification",
    `<!DOCTYPE html>
      <html>
      <head>
        <title>SkillMatch - OTP Verification</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
      
        <div class="container">
          <!-- Your email template content goes here -->
          <div style="text-align: center;">
            <img src=""  style="width: 150px; height: auto;">
          </div>
          <div style="text-align: left;">
            <h2>OTP Verification</h2>
            <p>Dear ${fullName},</p>
            <p>Your OTP for the skillmatch account is: <strong>${generatedOtp}</strong></p>
            <p>Please use this OTP to verify your account.</p>
            <p>If you didn't request this OTP, ignore this email.</p>
            <br>
            <p>Thank you,</p>
            <p>The SkillMatch Team</p>
          </div>
          <div style="background-color: #333333; color: #ffffff; padding: 20px; border-radius: 5px; text-align: center;">
            <p>&copy; ${currentYear} SkillMatch. All rights reserved.</p>
          </div>
        </div>
      
      </body>
      </html>
      `
  );
  return true;
}

async function changePasswordMail(email, fullName) {
  await sendMail(
    "SkillMatch",
    email,
    "SkillMatch - Password Changed",
    `
        <!DOCTYPE html>
        <html>
        <head>
          <title>SkillMatch - Password Changed</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
        
          <div class="container">
            <!-- Your email template content goes here -->
            <div style="text-align: center;">
              <img src="https://yourwebsite.com/logo.png" alt="SkillMatch Logo" style="width: 150px; height: auto;">
            </div>
            <div style="text-align: left;">
              <h2>Password Changed</h2>
              <p>Dear ${fullName},</p>
              <p>Your password for the SkillMatch account has been changed successfully.</p>
              <p>If you initiated this change, ignore this email.</p>
              <p>If you didn't request this change, please contact us immediately.</p>
              <br>
              <p>If you have any questions or need assistance, reach out to us.</p>
              <br>
              <p>Thank you,</p>
              <p>The SkillMatch Team</p>
            </div>
            <div style="background-color: #333333; color: #ffffff; padding: 20px; border-radius: 5px; text-align: center;">
              <p>&copy; ${currentYear} SkillMatch. All rights reserved.</p>
            </div>
          </div>
        
        </body>
        </html>
        
`
  );
}

export { generatedOtpMail, changePasswordMail };
