// Generate a random 4-digit OTP
export function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// In-memory OTP store (for development)
// In production, use Redis or database
const otpStore = new Map();

export function storeOtp(email, otp) {
  const normalizedEmail = email.toLowerCase().trim();
  otpStore.set(normalizedEmail, {
    otp,
    createdAt: Date.now(),
    attempts: 0,
  });
  
  // Auto-expire after 10 minutes
  setTimeout(() => {
    otpStore.delete(normalizedEmail);
  }, 10 * 60 * 1000);
}

export function verifyStoredOtp(email, inputOtp) {
  const normalizedEmail = email.toLowerCase().trim();
  const stored = otpStore.get(normalizedEmail);
  
  if (!stored) {
    return { valid: false, error: 'OTP expired or not found. Please request a new code.' };
  }
  
  // Check expiration (10 minutes)
  const age = Date.now() - stored.createdAt;
  if (age > 10 * 60 * 1000) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: 'OTP has expired. Please request a new code.' };
  }
  
  // Check max attempts
  if (stored.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: 'Too many attempts. Please request a new code.' };
  }
  
  // Increment attempts
  stored.attempts++;
  
  // Verify OTP
  if (stored.otp !== inputOtp) {
    return { valid: false, error: 'Invalid code. Please try again.' };
  }
  
  // Success - remove OTP
  otpStore.delete(normalizedEmail);
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
