import { sendEmail, generateOtpEmailHtml } from './_lib/resend.js';
import { supabase } from './_lib/supabase.js';
import { generateOtp, storeOtp, jsonResponse, errorResponse, corsHeaders } from './_lib/utils.js';

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders() });
  }

  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse('Email and password are required');
    }

    if (!email.endsWith('@u.nus.edu')) {
      return errorResponse('Only @u.nus.edu emails are allowed');
    }

    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters');
    }

    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return errorResponse('An account with this email already exists');
    }

    const otp = generateOtp();
    await storeOtp(email, otp);

    await sendEmail({
      to: email,
      subject: 'Verify your MealExchange account',
      html: generateOtpEmailHtml(otp),
    });

    return jsonResponse({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return errorResponse(error.message || 'Failed to send verification code', 500);
  }
}
