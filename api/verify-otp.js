import { supabaseAdmin, supabase } from './_lib/supabase.js';
import { verifyStoredOtp, jsonResponse, errorResponse, corsHeaders } from './_lib/utils.js';

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders() });
  }

  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp) {
      return errorResponse('Email and OTP are required');
    }

    const verification = await verifyStoredOtp(email, otp);
    if (!verification.valid) {
      return errorResponse(verification.error);
    }

    if (password) {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            email_confirmed: true,
          }
        }
      });

      if (signUpError) {
        return errorResponse(signUpError.message);
      }

      return jsonResponse({
        success: true,
        message: 'Account created successfully',
        user: authData.user,
        session: authData.session,
      });
    }

    return jsonResponse({
      success: true,
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return errorResponse(error.message || 'Verification failed', 500);
  }
}
