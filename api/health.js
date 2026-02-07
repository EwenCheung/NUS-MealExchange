import { supabase } from './_lib/supabase.js';
import { resend } from './_lib/resend.js';
import { jsonResponse, corsHeaders } from './_lib/utils.js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders() });
  }

  const checks = {
    supabase: false,
    resend: false,
    env: {
      SUPABASE_URL: !!process.env.SUPABASE_URL || !!process.env.VITE_SUPABASE_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    }
  };

  try {
    const { data, error } = await supabase.from('locations').select('id').limit(1);
    checks.supabase = !error;
  } catch (e) {
    checks.supabase = false;
  }

  checks.resend = !!resend;

  const allHealthy = checks.supabase && checks.resend;

  return jsonResponse({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  }, allHealthy ? 200 : 503);
}
