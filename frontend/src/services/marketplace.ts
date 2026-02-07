import { supabase, Offer, Request, Location, Profile } from '../lib/supabase';

export interface OfferWithDetails extends Offer {
    location: Location;
    profile: Profile;
}

export interface RequestWithDetails extends Request {
    location: Location;
    profile: Profile;
}

// Get all locations
export async function getLocations(): Promise<Location[]> {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('type', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Get pending offers (for marketplace)
export async function getPendingOffers(): Promise<OfferWithDetails[]> {
    const { data, error } = await supabase
        .from('offers')
        .select(`
      *,
      location:locations(*),
      profile:profiles(*)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get pending requests (for marketplace)
export async function getPendingRequests(): Promise<RequestWithDetails[]> {
    const { data, error } = await supabase
        .from('requests')
        .select(`
      *,
      location:locations(*),
      profile:profiles(*)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Create a new offer
export async function createOffer(offer: {
    location_id: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    meal_date: string;
    token_price: number;
    payment_method: 'token' | 'cash';
}): Promise<Offer> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error } = await supabase
        .from('offers')
        .insert({
            user_id: user.id,
            ...offer,
            expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Create a new request
export async function createRequest(request: {
    location_id: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    meal_date: string;
    token_price: number;
    payment_method: 'token' | 'cash';
}): Promise<Request> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data, error } = await supabase
        .from('requests')
        .insert({
            user_id: user.id,
            ...request,
            expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Get user's own offers
export async function getMyOffers(): Promise<OfferWithDetails[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('offers')
        .select(`
      *,
      location:locations(*),
      profile:profiles(*)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get user's own requests
export async function getMyRequests(): Promise<RequestWithDetails[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('requests')
        .select(`
      *,
      location:locations(*),
      profile:profiles(*)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Cancel an offer
export async function cancelOffer(offerId: string): Promise<void> {
    const { error } = await supabase
        .from('offers')
        .update({ status: 'cancelled' })
        .eq('id', offerId);

    if (error) throw error;
}

// Cancel a request
export async function cancelRequest(requestId: string): Promise<void> {
    const { error } = await supabase
        .from('requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

    if (error) throw error;
}
