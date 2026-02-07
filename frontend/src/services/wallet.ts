import { supabase, Transaction, Profile } from '../lib/supabase';

export interface WalletData {
    balance: number;
    lockedTokens: number;
    transactions: Transaction[];
}

// Get user's wallet data
export async function getWalletData(): Promise<WalletData> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get profile for balance
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('token_balance, locked_tokens')
        .eq('id', user.id)
        .single();

    if (profileError) throw profileError;

    // Get transactions
    const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (txError) throw txError;

    return {
        balance: profile?.token_balance || 0,
        lockedTokens: profile?.locked_tokens || 0,
        transactions: transactions || [],
    };
}

// Get user's token balance
export async function getTokenBalance(): Promise<{ balance: number; locked: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('profiles')
        .select('token_balance, locked_tokens')
        .eq('id', user.id)
        .single();

    if (error) throw error;

    return {
        balance: data?.token_balance || 0,
        locked: data?.locked_tokens || 0,
    };
}

// Get transaction history
export async function getTransactionHistory(limit = 20): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

// Check if user can spend tokens (respects -2 limit)
export async function canSpendTokens(amount: number): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('profiles')
        .select('token_balance')
        .eq('id', user.id)
        .single();

    if (!data) return false;
    return (data.token_balance - amount) >= -2;
}

// Get user's profile with token info
export async function getUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) return null;
    return data;
}
