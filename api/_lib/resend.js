import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'MealExchange <onboarding@resend.dev>';

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function requireResend() {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return resend;
}

export async function sendEmail({ to, subject, html, text }) {
  const client = requireResend();
  
  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  return data;
}

// OTP Email Template
export function generateOtpEmailHtml(otp, appName = 'MealExchange') {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
  <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #16a34a, #22c55e); padding: 12px; border-radius: 12px; margin-bottom: 16px;">
        <span style="font-size: 24px;">🍱</span>
      </div>
      <h1 style="color: #0f172a; font-size: 24px; margin: 0;">${appName}</h1>
    </div>
    
    <h2 style="color: #0f172a; font-size: 20px; text-align: center; margin-bottom: 16px;">Verify your email</h2>
    <p style="color: #64748b; text-align: center; margin-bottom: 32px;">Enter this code to complete your sign up:</p>
    
    <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <span style="font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16a34a;">${otp}</span>
    </div>
    
    <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 8px;">This code expires in 10 minutes.</p>
    <p style="color: #94a3b8; font-size: 14px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
    
    <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin: 0;">
      ${appName} - NUS Meal Credit Exchange Platform
    </p>
  </div>
</body>
</html>
`;
}
