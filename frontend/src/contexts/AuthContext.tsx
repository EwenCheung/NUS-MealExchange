import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Supabase errors to user-friendly messages
function getUserFriendlyError(errorMessage: string): string {
    const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Email or password is incorrect',
        'Email not confirmed': 'Please verify your email before signing in',
        'User already registered': 'An account with this email already exists. Try signing in instead.',
        'Password should be at least 6 characters': 'Password must be at least 8 characters',
        'rate limit exceeded': 'Too many attempts. Please wait a few minutes and try again.',
        'email rate limit exceeded': 'Too many signup attempts. Please wait a few minutes and try again.',
        'For security purposes': 'Please wait a moment before trying again.',
    };

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
        if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }

    return errorMessage;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setProfile(data as Profile);
        }
        return data;
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Simple signup - just email and password
    const signUp = async (email: string, password: string) => {
        if (!email.endsWith('@u.nus.edu')) {
            return { error: new Error('Only @u.nus.edu emails are allowed') };
        }

        if (password.length < 8) {
            return { error: new Error('Password must be at least 8 characters') };
        }

        // Sign up (Supabase with email confirmation disabled will auto-confirm)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { error: new Error(getUserFriendlyError(error.message)) };
        }

        // If user was created and session exists, they're logged in
        if (data.session) {
            return { error: null };
        }

        // If user created but no session, try signing in
        // (This happens when email confirmation is required but user exists)
        if (data.user && !data.session) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) {
                // Check if it's because email confirmation is required
                if (signInError.message.includes('Email not confirmed')) {
                    return { error: new Error('Account created! Please check your email to verify, or ask admin to disable email confirmation in Supabase.') };
                }
                return { error: new Error(getUserFriendlyError(signInError.message)) };
            }
        }

        return { error: null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: new Error(getUserFriendlyError(error.message)) };
        }

        return { error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            signUp,
            signIn,
            signOut,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
