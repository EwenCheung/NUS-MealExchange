const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ApiResponse<T = unknown> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API request failed: ${response.status}`);
  }

  return data;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  verified?: boolean;
  user?: {
    id: string;
    email: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  checks: {
    supabase: boolean;
    resend: boolean;
    env: Record<string, boolean>;
  };
}

export const api = {
  sendOtp: async (email: string, password: string): Promise<SendOtpResponse> => {
    return apiRequest<SendOtpResponse>('/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  verifyOtp: async (email: string, otp: string, password?: string): Promise<VerifyOtpResponse> => {
    return apiRequest<VerifyOtpResponse>('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, password }),
    });
  },

  health: async (): Promise<HealthResponse> => {
    return apiRequest<HealthResponse>('/health', {
      method: 'GET',
    });
  },
};

export default api;
