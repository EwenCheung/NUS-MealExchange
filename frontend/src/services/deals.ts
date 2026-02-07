import { supabase, Deal, Profile, Offer, Request } from '../lib/supabase';

export interface DealWithDetails extends Deal {
    offer: Offer | null;
    request: Request | null;
    provider: Profile;
    buyer: Profile;
}

// Accept an offer (buyer accepts provider's offer)
export async function acceptOffer(offerId: string): Promise<Deal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the offer details
    const { data: offer, error: offerError } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .single();

    if (offerError || !offer) throw new Error('Offer not found');
    if (offer.user_id === user.id) throw new Error('Cannot accept your own offer');

    // Check buyer has enough tokens (or allow negative up to -2)
    const { data: buyerProfile } = await supabase
        .from('profiles')
        .select('token_balance')
        .eq('id', user.id)
        .single();

    if (buyerProfile && (buyerProfile.token_balance - offer.token_price) < -2) {
        throw new Error('Insufficient tokens. Maximum debt is -2 tokens.');
    }

    // Create deal
    const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert({
            offer_id: offerId,
            request_id: null,
            provider_id: offer.user_id,
            buyer_id: user.id,
            token_amount: offer.token_price,
            escrow_locked: true,
            status: 'accepted',
        })
        .select()
        .single();

    if (dealError) throw dealError;

    // Update offer status
    await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

    // Lock tokens in escrow (subtract from buyer's balance, add to locked)
    await supabase.rpc('lock_tokens_in_escrow', {
        p_user_id: user.id,
        p_amount: offer.token_price,
        p_deal_id: deal.id,
    });

    return deal;
}

// Accept a request (provider accepts buyer's request)
export async function acceptRequest(requestId: string): Promise<Deal> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the request details
    const { data: request, error: requestError } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

    if (requestError || !request) throw new Error('Request not found');
    if (request.user_id === user.id) throw new Error('Cannot accept your own request');

    // Create deal
    const { data: deal, error: dealError } = await supabase
        .from('deals')
        .insert({
            offer_id: null,
            request_id: requestId,
            provider_id: user.id,
            buyer_id: request.user_id,
            token_amount: request.token_price,
            escrow_locked: true,
            status: 'accepted',
        })
        .select()
        .single();

    if (dealError) throw dealError;

    // Update request status
    await supabase
        .from('requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

    // Lock tokens in escrow from the request creator (buyer)
    await supabase.rpc('lock_tokens_in_escrow', {
        p_user_id: request.user_id,
        p_amount: request.token_price,
        p_deal_id: deal.id,
    });

    return deal;
}

// Complete a deal
export async function completeDeal(dealId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get deal details
    const { data: deal, error: dealError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .single();

    if (dealError || !deal) throw new Error('Deal not found');
    if (deal.buyer_id !== user.id) throw new Error('Only the buyer can complete the deal');

    // Release escrow and transfer tokens
    await supabase.rpc('complete_deal_transfer', {
        p_deal_id: dealId,
        p_provider_id: deal.provider_id,
        p_amount: deal.token_amount,
    });

    // Update deal status
    await supabase
        .from('deals')
        .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
        })
        .eq('id', dealId);

    // Update related offer/request status
    if (deal.offer_id) {
        await supabase.from('offers').update({ status: 'completed' }).eq('id', deal.offer_id);
    }
    if (deal.request_id) {
        await supabase.from('requests').update({ status: 'completed' }).eq('id', deal.request_id);
    }

    // Update swap counts for both users
    await supabase.rpc('increment_swap_count', { p_user_id: deal.provider_id });
    await supabase.rpc('increment_swap_count', { p_user_id: deal.buyer_id });
}

// Cancel a deal
export async function cancelDeal(dealId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get deal details
    const { data: deal, error: dealError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .single();

    if (dealError || !deal) throw new Error('Deal not found');
    if (deal.provider_id !== user.id && deal.buyer_id !== user.id) {
        throw new Error('You are not part of this deal');
    }

    // Refund escrow if locked
    if (deal.escrow_locked) {
        await supabase.rpc('refund_escrow', {
            p_deal_id: dealId,
            p_buyer_id: deal.buyer_id,
            p_amount: deal.token_amount,
        });
    }

    // Update deal status
    await supabase
        .from('deals')
        .update({ status: 'cancelled' })
        .eq('id', dealId);

    // Update related offer/request status
    if (deal.offer_id) {
        await supabase.from('offers').update({ status: 'cancelled' }).eq('id', deal.offer_id);
    }
    if (deal.request_id) {
        await supabase.from('requests').update({ status: 'cancelled' }).eq('id', deal.request_id);
    }
}

// Get user's active deals
export async function getMyDeals(): Promise<DealWithDetails[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('deals')
        .select(`
      *,
      offer:offers(*),
      request:requests(*),
      provider:profiles!deals_provider_id_fkey(*),
      buyer:profiles!deals_buyer_id_fkey(*)
    `)
        .or(`provider_id.eq.${user.id},buyer_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get a specific deal by ID
export async function getDealById(dealId: string): Promise<DealWithDetails | null> {
    const { data, error } = await supabase
        .from('deals')
        .select(`
      *,
      offer:offers(*),
      request:requests(*),
      provider:profiles!deals_provider_id_fkey(*),
      buyer:profiles!deals_buyer_id_fkey(*)
    `)
        .eq('id', dealId)
        .single();

    if (error) return null;
    return data;
}
