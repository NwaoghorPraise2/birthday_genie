export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #423a3a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF7FA;">
  <div style="background: linear-gradient(to right, #DE2A5D, #fd9ab6); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Verify Your Email</h1>
  </div>
  <div style="background-color: #FFE7EE; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello, {name}</p>
    <p>Thank you for signing up for Birthday App! Use the verification token below to verify your email address:</p>
    <div style="text-align: center; margin: 30px 0; font-size: 18px; font-weight: bold; color: #DE2A5D; background-color: #FFF7FA; padding: 10px; border-radius: 5px;">
      {verificationToken}
    </div>
    <p>If clicking the link does not work, copy and paste the following URL into your browser:</p>
    <p style="word-break: break-all; color: #423a3a; background-color: #FFF7FA; padding: 10px; border-radius: 5px;">{verificationLink}</p>
    <p>This token will expire in 15 minutes for security reasons.</p>
    <p>If you didn’t sign up for Birthday App, please ignore this email.</p>
    <p>Best regards,<br>Birthday App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #8e9299; font-size: 0.8em;">
    <p>For support, contact us at <a href="mailto:support@automusstech.com" style="color: #DE2A5D;">support@automusstech.com</a></p>
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #423a3a; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFF7FA;">
  <div style="background: linear-gradient(to right, #DE2A5D, #fd9ab6); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #FFE7EE; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {name}!</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #16b364; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Birthday App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #8e9299; font-size: 0.8em;">
    <p>For support, contact us at <a href="mailto:support@automusstech.com" style="color: #DE2A5D;">support@automusstech.com</a></p>
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #423a3a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #DE2A5D, #fd9ab6); padding: 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 48px;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #676767;">Hello, {name}!</p>
    <p style="font-size: 16px; color: #676767;">We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p style="font-size: 16px; color: #676767;">To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #16b364; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
    </div>
    <p style="font-size: 16px; color: #676767;">This link will expire in 1 hour for security reasons.</p>
    <p style="font-size: 16px; color: #676767;">Best regards,<br>Birthday App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>For support, contact us at <a href="mailto:support@automusstech.com" style="color: #dc6803;">support@automusstech.com</a></p>
    <p style="color: #676767;">This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

