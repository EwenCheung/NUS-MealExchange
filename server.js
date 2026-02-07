import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import 'dotenv/config';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'MealExchange <onboarding@resend.dev>';

// In-memory OTP store (for development)
const otpStore = new Map();

function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function storeOtp(email, otp) {
    const normalizedEmail = email.toLowerCase().trim();
    otpStore.set(normalizedEmail, {
        otp,
        createdAt: Date.now(),
        attempts: 0,
    });
    setTimeout(() => otpStore.delete(normalizedEmail), 10 * 60 * 1000);
}

function verifyStoredOtp(email, inputOtp) {
    const normalizedEmail = email.toLowerCase().trim();
    const stored = otpStore.get(normalizedEmail);

    if (!stored) {
        return { valid: false, error: 'OTP expired or not found' };
    }

    if (Date.now() - stored.createdAt > 10 * 60 * 1000) {
        otpStore.delete(normalizedEmail);
        return { valid: false, error: 'OTP has expired' };
    }

    if (stored.attempts >= 5) {
        otpStore.delete(normalizedEmail);
        return { valid: false, error: 'Too many attempts' };
    }

    stored.attempts++;

    if (stored.otp !== inputOtp) {
        return { valid: false, error: 'Invalid code' };
    }

    otpStore.delete(normalizedEmail);
    return { valid: true };
}

// Generate OTP email HTML
function generateOtpEmailHtml(otp) {
    return `
    <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #16a34a;">MealExchange</h1>
      <h2>Verify your email</h2>
      <p>Enter this code to complete your sign up:</p>
      <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16a34a;">${otp}</span>
      </div>
      <p style="color: #666;">This code expires in 10 minutes.</p>
    </div>
  `;
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
            supabase: !!supabaseUrl,
            resend: !!resend,
            env: {
                SUPABASE_URL: !!supabaseUrl,
                RESEND_API_KEY: !!process.env.RESEND_API_KEY,
            }
        }
    });
});

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (!email.endsWith('@u.nus.edu')) {
            return res.status(400).json({ error: 'Only @u.nus.edu emails are allowed' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email already exists' });
        }

        const otp = generateOtp();
        storeOtp(email, otp);

        // Send email via Resend
        if (resend) {
            await resend.emails.send({
                from: fromEmail,
                to: [email],
                subject: 'Verify your MealExchange account',
                html: generateOtpEmailHtml(otp),
            });
        } else {
            console.log('📧 OTP for', email, ':', otp);
        }

        res.json({ success: true, message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to send verification code' });
    }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const verification = verifyStoredOtp(email, otp);
        if (!verification.valid) {
            return res.status(400).json({ error: verification.error });
        }

        if (password) {
            // Create the user in Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { email_confirmed: true }
                }
            });

            if (signUpError) {
                return res.status(400).json({ error: signUpError.message });
            }

            return res.json({
                success: true,
                message: 'Account created successfully',
                user: authData.user,
                session: authData.session,
            });
        }

        res.json({
            success: true,
            message: 'Email verified successfully',
            verified: true,
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: error.message || 'Verification failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`📧 Resend: ${resend ? 'configured' : 'NOT configured (OTPs will be logged)'}`);
});
