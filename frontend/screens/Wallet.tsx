import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { getWalletData, WalletData } from '../src/services/wallet';

interface WalletProps {
  onNavigate: (screen: Screen) => void;
}

export const Wallet: React.FC<WalletProps> = ({ onNavigate }) => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const data = await getWalletData();
      setWalletData(data);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn': return { icon: 'paid', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'spend': return { icon: 'shopping_bag', color: 'text-nus-orange', bg: 'bg-nus-orange/10' };
      case 'refund': return { icon: 'settings_backup_restore', color: 'text-slate-500', bg: 'bg-slate-100' };
      case 'escrow_lock': return { icon: 'lock', color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'escrow_release': return { icon: 'lock_open', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      default: return { icon: 'paid', color: 'text-slate-500', bg: 'bg-slate-100' };
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'earn':
      case 'refund':
      case 'escrow_release':
        return 'text-emerald-500';
      case 'spend':
      case 'escrow_lock':
        return 'text-nus-orange';
      default: return 'text-slate-900';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const balance = walletData?.balance ?? profile?.token_balance ?? 0;
  const lockedTokens = walletData?.lockedTokens ?? profile?.locked_tokens ?? 0;
  const transactions = walletData?.transactions || [];
  const isLowBalance = balance < 0.5;

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-32">
      <header className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="w-8"></div>
          <h1 className="text-lg font-extrabold tracking-tight text-nus-blue">Wallet & History</h1>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="flex-1 px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nus-blue"></div>
          </div>
        ) : (
          <>
            {/* Wallet Card */}
            <div className="mt-4 p-8 rounded-[2rem] bg-nus-blue shadow-2xl shadow-nus-blue/20 relative overflow-hidden text-center text-white">
              <div className="relative z-10">
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">Available Balance</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-amber-accent text-4xl fill-1">monetization_on</span>
                  <span className="text-6xl font-black text-amber-accent tracking-tight">{balance.toFixed(1)}</span>
                </div>
                <p className="text-white/90 font-medium mt-1">Tokens</p>
                {lockedTokens > 0 && (
                  <div className="mt-6 inline-flex items-center gap-2 bg-amber-accent/20 border border-amber-accent/30 px-4 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-amber-accent text-sm fill-1">lock</span>
                    <span className="text-amber-accent text-xs font-bold">{lockedTokens.toFixed(1)} Locked in Escrow</span>
                  </div>
                )}
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-amber-accent/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => onNavigate(Screen.CREATE_OFFER)}
                className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500">add_card</span>
                </div>
                <span className="text-xs font-bold text-slate-600">Provide Meal</span>
              </button>
              <button
                onClick={() => onNavigate(Screen.CREATE_OFFER)}
                className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-nus-blue/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-nus-blue">shopping_basket</span>
                </div>
                <span className="text-xs font-bold text-slate-600">Request Meal</span>
              </button>
            </div>

            {/* Warning Banner */}
            {isLowBalance && (
              <div className="mt-6 p-4 rounded-2xl bg-orange-50 border-l-4 border-nus-orange flex gap-3 items-center">
                <span className="material-symbols-outlined text-nus-orange fill-1">warning</span>
                <div className="flex-1">
                  <p className="text-slate-800 font-bold text-xs">Low token balance</p>
                  <p className="text-slate-500 text-[10px]">Provide a meal to earn more tokens.</p>
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-nus-blue">Activity Timeline</h2>
                <button className="text-nus-blue text-xs font-bold px-3 py-1 bg-nus-blue/5 rounded-full">Filter</button>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
                  <p className="text-slate-500 mt-2">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-0 relative">
                  {transactions.map((tx, idx) => {
                    const style = getTransactionIcon(tx.type);
                    const amountColor = getAmountColor(tx.type);
                    const isLast = idx === transactions.length - 1;
                    return (
                      <div key={tx.id} className="relative pb-8 flex gap-4">
                        {!isLast && <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-200"></div>}
                        <div className="z-10 w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                          <span className={`material-symbols-outlined text-2xl fill-1 ${style.color}`}>{style.icon}</span>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-slate-800">{tx.description || tx.type.replace('_', ' ').toUpperCase()}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{tx.type.replace('_', ' ').toUpperCase()}</p>
                            </div>
                            <span className={`${amountColor} font-black text-sm`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(1)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${tx.amount > 0 ? 'bg-emerald-500' : 'bg-nus-orange'}`}></span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${amountColor}`}>{tx.type.replace('_', ' ')}</span>
                            <span className="text-[9px] text-slate-300 ml-auto">{formatDate(tx.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};