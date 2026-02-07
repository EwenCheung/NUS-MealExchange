import React from 'react';
import { Screen, Swap } from '../types';

interface MySwapsProps {
  onNavigate: (screen: Screen) => void;
}

export const MySwaps: React.FC<MySwapsProps> = ({ onNavigate }) => {
  const activeSwaps: Swap[] = [
    {
      id: '1',
      location: 'Fine Food - Mixed Rice',
      stall: 'Mixed Rice',
      partner: '@jason_nus',
      partnerAvatar: 'https://picsum.photos/seed/jason/100',
      status: 'AWAITING_PICKUP',
      price: 4.50,
      time: '12:30 PM'
    },
    {
      id: '2',
      location: 'The Deck - Chicken Rice',
      stall: 'Chicken Rice',
      partner: '@sarah_lee',
      partnerAvatar: 'https://picsum.photos/seed/sarah/100',
      status: 'MEETING',
      price: 3.80,
      time: '1:15 PM'
    }
  ];

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-32">
      <header className="sticky top-0 z-20 bg-background-light/95 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 pl-2">My Swaps</h1>
      </header>

      {/* Spacing where tabs used to be */}
      <div className="h-4"></div>

      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 text-base font-bold">In Progress</h3>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">2 Active</span>
        </div>

        {activeSwaps.map(swap => (
          <div key={swap.id} className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
             <div className="flex justify-between items-start">
               <div className="flex gap-3">
                 <img src={swap.partnerAvatar} alt="" className="size-12 rounded-lg object-cover bg-slate-100" />
                 <div className="flex flex-col">
                   <span className="text-xs font-semibold text-primary uppercase tracking-wider">{swap.status.replace('_', ' ')}</span>
                   <p className="text-slate-900 text-base font-bold leading-tight mt-0.5">{swap.location}</p>
                   <p className="text-slate-500 text-sm">Partner: {swap.partner}</p>
                 </div>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-amber-accent text-sm font-bold">${swap.price.toFixed(2)}</span>
                 <span className="text-slate-400 text-[10px] uppercase">{swap.time}</span>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <button onClick={() => onNavigate(Screen.CHAT)} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary h-10 px-4 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform">
                 <span className="material-symbols-outlined text-[18px]">chat</span>
                 Chat
               </button>
               <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                 <span className="material-symbols-outlined">more_horiz</span>
               </button>
             </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 text-base font-bold">Recent History</h3>
          <button className="text-sm font-semibold text-primary">View All</button>
        </div>
        <div className="space-y-3">
           <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100">
             <div className="size-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
               <span className="material-symbols-outlined">check_circle</span>
             </div>
             <div className="flex-1">
               <p className="text-slate-900 text-sm font-bold">Techno Edge - Laksa</p>
               <p className="text-slate-500 text-xs">Oct 24 • Completed with @mike_tan</p>
             </div>
             <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">+10 pts</span>
           </div>

           <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100">
             <div className="size-10 flex items-center justify-center rounded-full bg-rose-100 text-rose-600">
               <span className="material-symbols-outlined">cancel</span>
             </div>
             <div className="flex-1">
               <p className="text-slate-900 text-sm font-bold">Frontier - Pasta</p>
               <p className="text-slate-500 text-xs">Oct 22 • Cancelled</p>
             </div>
             <span className="text-rose-600 text-xs font-bold bg-rose-50 px-2 py-0.5 rounded">Refunded</span>
           </div>
        </div>
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-[400px] px-6 pointer-events-none">
         <button onClick={() => onNavigate(Screen.CREATE_OFFER)} className="pointer-events-auto w-full h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center gap-2 font-bold text-base active:scale-95 transition-all">
           <span className="material-symbols-outlined">add</span>
           New Swap Offer
         </button>
      </div>
    </div>
  );
};