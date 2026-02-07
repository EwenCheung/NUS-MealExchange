import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { getDealMessages, sendMessage, subscribeToMessages, unsubscribeFromMessages, MessageWithSender } from '../src/services/chat';
import { getDealById, completeDeal, DealWithDetails } from '../src/services/deals';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ChatProps {
  onBack: () => void;
  dealId?: string;
}

export const Chat: React.FC<ChatProps> = ({ onBack, dealId }) => {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [deal, setDeal] = useState<DealWithDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const channelRef = useRef<RealtimeChannel | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (dealId) {
      loadData();
      setupRealtime();
    }

    return () => {
      if (channelRef.current) {
        unsubscribeFromMessages(channelRef.current);
      }
    };
  }, [dealId]);

  const loadData = async () => {
    if (!dealId) return;

    try {
      const [dealData, messagesData] = await Promise.all([
        getDealById(dealId),
        getDealMessages(dealId),
      ]);
      setDeal(dealData);
      setMessages(messagesData);
    } catch (err) {
      console.error('Failed to load chat data:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    if (!dealId) return;

    channelRef.current = subscribeToMessages(dealId, (message) => {
      setMessages(prev => [...prev, message]);
    });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !dealId) return;

    setSending(true);
    try {
      await sendMessage(dealId, newMessage.trim());
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleComplete = async () => {
    if (!dealId) return;

    setCompleting(true);
    try {
      await completeDeal(dealId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to complete deal');
    } finally {
      setCompleting(false);
    }
  };

  const partner = deal ? (deal.provider_id === user?.id ? deal.buyer : deal.provider) : null;
  const isProvider = deal?.provider_id === user?.id;
  const location = deal?.offer?.location || deal?.request?.location;
  const canComplete = deal?.status === 'accepted' && !isProvider;

  // Demo mode if no dealId
  if (!dealId) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen flex flex-col">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="text-nus-blue">
                <span className="material-symbols-outlined font-bold">arrow_back_ios</span>
              </button>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/alex/100" alt="Alex Tan" className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
                <div>
                  <h2 className="text-sm font-bold leading-tight">Demo Chat</h2>
                  <p className="text-[10px] text-slate-400">Select a deal to start chatting</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300">chat</span>
            <p className="text-slate-500 mt-4">Select a deal from My Swaps to chat</p>
            <button onClick={onBack} className="mt-4 text-primary font-semibold">Go to My Swaps</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nus-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex flex-col">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-nus-blue">
              <span className="material-symbols-outlined font-bold">arrow_back_ios</span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src={partner?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${partner?.display_name}`}
                alt={partner?.display_name || 'Partner'}
                className="w-10 h-10 rounded-full border border-slate-100 object-cover"
              />
              <div>
                <h2 className="text-sm font-bold leading-tight">{partner?.display_name || 'User'}</h2>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
              <span className="material-symbols-outlined text-[22px]">more_horiz</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Deal Card */}
        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">restaurant</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[15px]">{location?.name || 'Meal Exchange'}</h3>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${deal?.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                    <span className="material-symbols-outlined text-[12px] fill-1">
                      {deal?.status === 'completed' ? 'check_circle' : 'schedule'}
                    </span>
                    {deal?.status?.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-1">
                  1x {deal?.offer?.meal_type || deal?.request?.meal_type || 'Meal'} Credit
                </p>
                <p className="text-nus-orange font-bold text-sm">{deal?.token_amount} Tokens</p>
              </div>
            </div>
            {canComplete && (
              <div className="px-4 pb-4">
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full bg-nus-blue text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                  {completing ? 'Completing...' : 'Complete Deal'}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2.5 px-6">
                  Confirm completion only after receiving your meal. Tokens are held in escrow.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 px-4 flex flex-col gap-4 pb-4 overflow-y-auto">
          {deal?.escrow_locked && (
            <div className="flex justify-center my-2">
              <div className="bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200/50">
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  {deal.token_amount} Tokens locked in escrow
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                <img
                  src={msg.sender?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender?.display_name}`}
                  className="w-7 h-7 rounded-full object-cover mb-1"
                  alt=""
                />
                <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${isMe
                    ? 'bg-nus-blue text-white rounded-br-none'
                    : 'bg-[#EBF2FA] text-slate-800 rounded-bl-none'
                  }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-100 p-4 pb-8">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100">
              <span className="material-symbols-outlined">add</span>
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Message ${partner?.display_name || 'partner'}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full h-11 bg-slate-100 border-none rounded-2xl px-5 py-2 text-sm focus:ring-2 focus:ring-nus-blue/20 placeholder:text-slate-400 focus:bg-white transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                className="absolute right-2 top-1.5 w-8 h-8 bg-nus-blue text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};