import React from 'react';
import { Transaction, Screen } from '../types';

interface WalletProps {
  onNavigate: (screen: Screen) => void;
}

export const Wallet: React.FC<WalletProps> = ({ onNavigate }) => {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'EARN',
      title: 'Earned Credits',
      subtitle: 'Tembusu College • Dinner',
      amount: 0.5,
      date: 'Today, 7:24 PM'
    },
    {
      id: '2',
      type: 'SPEND',
      title: 'Meal Swap',
      subtitle: 'RC4 • Lunch',
      amount: -0.5,
      date: 'Yesterday'
    },
    {
      id: '3',
      type: 'REFUND',
      title: 'Cancelled Swap',
      subtitle: 'Cinnamon College • Breakfast',
      amount: 0.5,
      date: '12 Jan, 2024'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'EARN': return { icon: 'paid', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'SPEND': return { icon: 'shopping_bag', color: 'text-nus-orange', bg: 'bg-nus-orange/10' };
      case 'REFUND': return { icon: 'settings_backup_restore', color: 'text-slate-500', bg: 'bg-slate-100' };
      default: return { icon: 'paid', color: 'text-slate-500', bg: 'bg-slate-100' };
    }
  };

  const getAmountColor = (type: string) => {
    switch(type) {
      case 'EARN': return 'text-emerald-500';
      case 'SPEND': return 'text-nus-orange';
      case 'REFUND': return 'text-slate-500';
      default: return 'text-slate-900';
    }
  };

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
        {/* Wallet Card */}
        <div className="mt-4 p-8 rounded-[2rem] bg-nus-blue shadow-2xl shadow-nus-blue/20 relative overflow-hidden text-center text-white">
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">Available Balance</p>
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-amber-accent text-4xl fill-1">monetization_on</span>
              <span className="text-6xl font-black text-amber-accent tracking-tight">1.5</span>
            </div>
            <p className="text-white/90 font-medium mt-1">Tokens</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-amber-accent/20 border border-amber-accent/30 px-4 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-amber-accent text-sm fill-1">lock</span>
              <span className="text-amber-accent text-xs font-bold">0.5 Locked in Escrow</span>
            </div>
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
        <div className="mt-6 p-4 rounded-2xl bg-orange-50 border-l-4 border-nus-orange flex gap-3 items-center">
          <span className="material-symbols-outlined text-nus-orange fill-1">warning</span>
          <div className="flex-1">
            <p className="text-slate-800 font-bold text-xs">Approaching token limit</p>
            <p className="text-slate-500 text-[10px]">Provide a meal to keep your balance healthy.</p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-nus-blue">Activity Timeline</h2>
            <button className="text-nus-blue text-xs font-bold px-3 py-1 bg-nus-blue/5 rounded-full">Filter</button>
          </div>

          <div className="space-y-0 relative">
            {transactions.map((tx, idx) => {
              const style = getTransactionIcon(tx.type);
              const amountColor = getAmountColor(tx.type);
              const isLast = idx === transactions.length - 1;
              return (
                <div key={tx.id} className="relative pb-8 flex gap-4">
                   {!isLast && <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-200"></div>}
                  <div className={`z-10 w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined text-2xl fill-1 ${style.color}`}>{style.icon}</span>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-slate-800">{tx.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{tx.subtitle}</p>
                      </div>
                      <span className={`${amountColor} font-black text-sm`}>{tx.amount > 0 ? '+' : ''}{tx.amount}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'EARN' ? 'bg-emerald-500' : tx.type === 'SPEND' ? 'bg-nus-orange' : 'bg-slate-400'}`}></span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${amountColor}`}>{tx.type}</span>
                      <span className="text-[9px] text-slate-300 ml-auto">{tx.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};