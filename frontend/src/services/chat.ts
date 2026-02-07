import { supabase, Message, Profile } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface MessageWithSender extends Message {
    sender: Profile;
}

// Get messages for a deal
export async function getDealMessages(dealId: string): Promise<MessageWithSender[]> {
    const { data, error } = await supabase
        .from('messages')
        .select(`
      *,
      sender:profiles(*)
    `)
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

// Send a message
export async function sendMessage(dealId: string, content: string, imageUrl?: string): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('messages')
        .insert({
            deal_id: dealId,
            sender_id: user.id,
            content,
            image_url: imageUrl || null,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Subscribe to new messages in a deal (real-time)
export function subscribeToMessages(
    dealId: string,
    onMessage: (message: MessageWithSender) => void
): RealtimeChannel {
    const channel = supabase
        .channel(`messages:${dealId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `deal_id=eq.${dealId}`,
            },
            async (payload) => {
                // Fetch the complete message with sender info
                const { data } = await supabase
                    .from('messages')
                    .select(`
            *,
            sender:profiles(*)
          `)
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    onMessage(data as MessageWithSender);
                }
            }
        )
        .subscribe();

    return channel;
}

// Unsubscribe from messages
export function unsubscribeFromMessages(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
}

// Get unread message count for a deal
export async function getUnreadCount(dealId: string, lastReadAt: string): Promise<number> {
    const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('deal_id', dealId)
        .gt('created_at', lastReadAt);

    if (error) return 0;
    return count || 0;
}
