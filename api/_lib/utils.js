import { supabaseAdmin } from './supabase.js';

// Generate a random 4-digit OTP
export function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function storeOtp(email, otp) {
  if (!supabaseAdmin) {
    console.error('SUPABASE_SERVICE_ROLE_KEY missing, falling back to memory (will fail in production)');
    return; // Fallback or throw? Better to log specific error.
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Delete existing OTPs for this email
  await supabaseAdmin
    .from('verification_codes')
    .delete()
    .eq('email', normalizedEmail);

  // Insert new OTP
  const { error } = await supabaseAdmin
    .from('verification_codes')
    .insert({
      email: normalizedEmail,
      otp,
      // expires_at defaults to +10 mins in SQL
    });

  if (error) {
    console.error('Failed to store OTP:', error);
    throw new Error('Database error storing OTP');
  }
}

export async function verifyStoredOtp(email, inputOtp) {
  if (!supabaseAdmin) {
    return { valid: false, error: 'Server misconfiguration: Missing Service Key' };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const { data, error } = await supabaseAdmin
    .from('verification_codes')
    .select('*')
    .eq('email', normalizedEmail)
    .single();

  if (error || !data) {
    return { valid: false, error: 'OTP expired or not found. Please request a new code.' };
  }

  // Check expiration
  if (new Date(data.expires_at) < new Date()) {
    await supabaseAdmin.from('verification_codes').delete().eq('email', normalizedEmail);
    return { valid: false, error: 'OTP has expired. Please request a new code.' };
  }

  // Verify OTP
  if (data.otp !== inputOtp) {
    return { valid: false, error: 'Invalid code. Please try again.' };
  }

  // Success - remove OTP
  await supabaseAdmin.from('verification_codes').delete().eq('email', normalizedEmail);
  return { valid: true };
}

// CORS headers for API responses
export function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Standard JSON response helper
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

// Error response helper
export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}
