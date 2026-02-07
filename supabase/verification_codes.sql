-- Table to store verification codes (OTPs)
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes')
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);

-- RLS Policies
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (since users aren't logged in yet)
-- In a real app, you might want strict server-side only access, 
-- but if using client-side calls (not recommended for OTP), you'd need this.
-- Since we are using server-side API routes, we can use Service Role, 
-- so strictly speaking RLS isn't blocked if using service key.
-- But for safety:
CREATE POLICY "Service role can do anything" ON public.verification_codes
  USING (true)
  WITH CHECK (true);
