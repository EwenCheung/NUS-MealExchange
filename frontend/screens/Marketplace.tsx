import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { getPendingOffers, getPendingRequests, OfferWithDetails, RequestWithDetails } from '../src/services/marketplace';
import { acceptOffer, acceptRequest } from '../src/services/deals';

interface MarketplaceProps {
  onNavigate: (screen: Screen) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Requests' | 'Offers'>('Requests');
  const [offers, setOffers] = useState<OfferWithDetails[]>([]);
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState<string | null>(null);
  const { profile, user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [offersData, requestsData] = await Promise.all([
        getPendingOffers(),
        getPendingRequests(),
      ]);
      setOffers(offersData);
      setRequests(requestsData);
    } catch (err) {
      setError('Failed to load marketplace data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!user) {
      onNavigate(Screen.LOGIN);
      return;
    }

    setAccepting(offerId);
    try {
      const deal = await acceptOffer(offerId);
      onNavigate(Screen.CHAT, { dealId: deal.id });
    } catch (err: any) {
      setError(err.message || 'Failed to accept offer');
    } finally {
      setAccepting(null);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) {
      onNavigate(Screen.LOGIN);
      return;
    }

    setAccepting(requestId);
    try {
      const deal = await acceptRequest(requestId);
      onNavigate(Screen.CHAT, { dealId: deal.id });
    } catch (err: any) {
      setError(err.message || 'Failed to accept request');
    } finally {
      setAccepting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const items = activeTab === 'Offers' ? offers : requests;

  return (
    <div className="pb-32 bg-off-white min-h-screen">
      {/* Header */}
      <header className="bg-nus-blue text-white sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-warm-amber">restaurant</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">MealExchange</h1>
              <p className="text-[10px] text-blue-200 font-medium tracking-wide uppercase">NUS Marketplace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate(Screen.PROFILE)} className="size-9 rounded-full border-2 border-warm-amber overflow-hidden">
              <img
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.display_name || 'User'}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="px-5 pb-5">
          <div className="bg-warm-amber rounded-2xl p-4 flex items-center justify-between shadow-md text-nus-blue">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <span className="material-symbols-outlined font-bold">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-[11px] font-bold opacity-70 uppercase tracking-wider">Your Balance</p>
                <p className="text-xl font-extrabold">
                  {profile?.token_balance?.toFixed(1) || '0.0'} <span className="text-sm font-semibold">Tokens</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(Screen.WALLET)}
              className="bg-nus-blue text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
            >
              Top Up
              <span className="material-symbols-outlined text-sm">add_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-[148px] z-30 bg-off-white/95 backdrop-blur-md pt-4 pb-2 px-5 space-y-5">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search Halls, RCs, or Meal Types..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-nus-blue/20 focus:border-nus-blue outline-none text-sm shadow-sm transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Halls', 'RCs', 'NUSC', 'Breakfast'].map((filter, i) => (
            <button
              key={filter}
              className={`flex-none px-5 py-2 rounded-full font-semibold text-sm transition-colors ${i === 0 ? 'bg-nus-blue text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-nus-blue/50'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex border-b border-slate-200 pt-1">
          <button
            onClick={() => setActiveTab('Requests')}
            className={`flex-1 py-3 text-sm font-bold relative transition-colors ${activeTab === 'Requests' ? 'text-nus-blue' : 'text-slate-400'}`}
          >
            Requests
            {activeTab === 'Requests' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-nus-blue rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('Offers')}
            className={`flex-1 py-3 text-sm font-bold relative transition-colors ${activeTab === 'Offers' ? 'text-nus-blue' : 'text-slate-400'}`}
          >
            Offers
            {activeTab === 'Offers' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-nus-blue rounded-t-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-5 mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Feed */}
      <main className="px-5 mt-4 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nus-blue mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading marketplace...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300">inbox</span>
            <p className="text-slate-500 mt-4">No {activeTab.toLowerCase()} available</p>
            <p className="text-slate-400 text-sm">Be the first to post one!</p>
          </div>
        ) : (
          items.map((item) => {
            const isOffer = 'user_id' in item && activeTab === 'Offers';
            const isOwn = item.user_id === user?.id;

            return (
              <div key={item.id} className="bg-white rounded-card p-5 shadow-soft border border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-green/10 text-emerald-green">
                        ACTIVE
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{item.location?.name || 'Unknown Location'}</h3>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-sm">{item.location?.type?.toUpperCase() || 'Location'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        <span className="text-sm">
                          {item.meal_type?.charAt(0).toUpperCase() + item.meal_type?.slice(1)} • {item.meal_date ? formatDate(item.meal_date) : 'Flexible'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-warm-amber/10 px-3 py-2 rounded-xl text-center min-w-[64px]">
                    <div className="text-warm-amber font-extrabold text-xl leading-none">{item.token_price}</div>
                    <div className="text-[9px] font-bold text-warm-amber/80 uppercase">Tokens</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full overflow-hidden border border-slate-100">
                      <img
                        src={item.profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${item.profile?.display_name}`}
                        alt={item.profile?.display_name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {item.profile?.display_name || 'Anonymous'}
                    </span>
                  </div>
                  {isOwn ? (
                    <span className="bg-slate-100 text-slate-500 px-5 py-2 rounded-xl font-bold text-sm">
                      Your Post
                    </span>
                  ) : (
                    <button
                      onClick={() => isOffer ? handleAcceptOffer(item.id) : handleAcceptRequest(item.id)}
                      disabled={accepting === item.id}
                      className="bg-nus-blue text-white px-5 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all disabled:opacity-50"
                    >
                      {accepting === item.id ? 'Accepting...' : 'Fulfill'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 z-40 w-full max-w-[480px] left-1/2 -translate-x-1/2 px-6 pointer-events-none flex justify-end">
        <button
          onClick={() => onNavigate(Screen.CREATE_OFFER)}
          className="pointer-events-auto size-14 bg-nus-blue text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </div>
    </div>
  );
};