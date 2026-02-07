import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { getMyDeals, DealWithDetails } from '../src/services/deals';

interface MySwapsProps {
  onNavigate: (screen: Screen) => void;
}

export const MySwaps: React.FC<MySwapsProps> = ({ onNavigate }) => {
  const [deals, setDeals] = useState<DealWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getMyDeals();
      setDeals(data);
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeDeals = deals.filter(d => d.status === 'accepted');
  const completedDeals = deals.filter(d => d.status === 'completed');
  const cancelledDeals = deals.filter(d => d.status === 'cancelled');

  const getPartner = (deal: DealWithDetails) => {
    return deal.provider_id === user?.id ? deal.buyer : deal.provider;
  };

  const getStatusLabel = (deal: DealWithDetails) => {
    if (deal.status === 'accepted') {
      return deal.escrow_locked ? 'AWAITING COMPLETION' : 'IN PROGRESS';
    }
    return deal.status.toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-32">
      <header className="sticky top-0 z-20 bg-background-light/95 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 pl-2">My Swaps</h1>
      </header>

      <div className="h-4"></div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Active Deals */}
          <div className="px-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 text-base font-bold">In Progress</h3>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {activeDeals.length} Active
              </span>
            </div>

            {activeDeals.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-4xl text-slate-300">sync_alt</span>
                <p className="text-slate-500 mt-2">No active swaps</p>
              </div>
            ) : (
              activeDeals.map(deal => {
                const partner = getPartner(deal);
                const location = deal.offer?.location || deal.request?.location;

                return (
                  <div key={deal.id} className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <img
                          src={partner?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${partner?.display_name}`}
                          alt=""
                          className="size-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {getStatusLabel(deal)}
                          </span>
                          <p className="text-slate-900 text-base font-bold leading-tight mt-0.5">
                            {location?.name || 'Meal Exchange'}
                          </p>
                          <p className="text-slate-500 text-sm">Partner: @{partner?.display_name || 'User'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-amber-accent text-sm font-bold">{deal.token_amount} Tokens</span>
                        <span className="text-slate-400 text-[10px] uppercase">{formatTime(deal.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate(Screen.CHAT, { dealId: deal.id })}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-4 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        Chat
                      </button>
                      <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent History */}
          <div className="px-4 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 text-base font-bold">Recent History</h3>
              <button className="text-sm font-semibold text-primary">View All</button>
            </div>
            <div className="space-y-3">
              {[...completedDeals, ...cancelledDeals].slice(0, 5).map(deal => {
                const partner = getPartner(deal);
                const location = deal.offer?.location || deal.request?.location;
                const isCompleted = deal.status === 'completed';

                return (
                  <div key={deal.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100">
                    <div className={`size-10 flex items-center justify-center rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      <span className="material-symbols-outlined">{isCompleted ? 'check_circle' : 'cancel'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm font-bold">{location?.name || 'Meal Exchange'}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(deal.completed_at || deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        • {isCompleted ? 'Completed' : 'Cancelled'} with @{partner?.display_name}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${isCompleted ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      {isCompleted ? `+${deal.token_amount}` : 'Refunded'}
                    </span>
                  </div>
                );
              })}

              {completedDeals.length + cancelledDeals.length === 0 && (
                <div className="text-center py-6 bg-white rounded-xl border border-slate-100">
                  <p className="text-slate-400 text-sm">No history yet</p>
                </div>
              )}
            </div>
          </div>

          {/* FAB */}
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-[400px] px-6 pointer-events-none">
            <button
              onClick={() => onNavigate(Screen.CREATE_OFFER)}
              className="pointer-events-auto w-full h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center gap-2 font-bold text-base active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              New Swap Offer
            </button>
          </div>
        </>
      )}
    </div>
  );
};