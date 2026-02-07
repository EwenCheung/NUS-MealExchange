import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'set' : 'missing');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'set' : 'missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

export interface Profile {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
    token_balance: number;
    locked_tokens: number;
    total_swaps: number;
    trust_rating: number;
    is_blacklisted: boolean;
    created_at: string;
}

export interface Location {
    id: number;
    name: string;
    type: 'hall' | 'rc' | 'nusc';
    default_price: number;
}

export interface Offer {
    id: string;
    user_id: string;
    location_id: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    meal_date: string;
    token_price: number;
    payment_method: 'token' | 'cash';
    status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'expired';
    expires_at: string;
    created_at: string;
    location?: Location;
    profile?: Profile;
}

export interface Request {
    id: string;
    user_id: string;
    location_id: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    meal_date: string;
    token_price: number;
    payment_method: 'token' | 'cash';
    status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'expired';
    expires_at: string;
    created_at: string;
    location?: Location;
    profile?: Profile;
}

export interface Deal {
    id: string;
    offer_id: string | null;
    request_id: string | null;
    provider_id: string;
    buyer_id: string;
    token_amount: number;
    escrow_locked: boolean;
    status: 'accepted' | 'completed' | 'cancelled';
    completed_at: string | null;
    created_at: string;
    offer?: Offer;
    request?: Request;
    provider?: Profile;
    buyer?: Profile;
}

export interface Transaction {
    id: string;
    user_id: string;
    deal_id: string | null;
    type: 'earn' | 'spend' | 'refund' | 'escrow_lock' | 'escrow_release';
    amount: number;
    description: string;
    created_at: string;
}

export interface Message {
    id: string;
    deal_id: string;
    sender_id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    sender?: Profile;
}
