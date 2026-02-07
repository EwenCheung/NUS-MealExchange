import React from 'react';

interface ChatProps {
  onBack: () => void;
}

export const Chat: React.FC<ChatProps> = ({ onBack }) => {
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
              <img src="https://picsum.photos/seed/alex/100" alt="Alex Tan" className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
              <div>
                <h2 className="text-sm font-bold leading-tight">Alex Tan</h2>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Online</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><span className="material-symbols-outlined text-[22px]">call</span></button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><span className="material-symbols-outlined text-[22px]">more_horiz</span></button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Deal Card */}
        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 flex gap-4">
              <img src="https://picsum.photos/seed/food/200" alt="Meal" className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[15px]">Tembusu Dining Hall</h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                    <span className="material-symbols-outlined text-[12px] fill-1">check_circle</span>
                    ACCEPTED
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-1">1x Breakfast Credit • Monday</p>
                <p className="text-nus-orange font-bold text-sm">5.0 Tokens</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button className="w-full bg-nus-blue text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                <span className="material-symbols-outlined text-xl">verified_user</span>
                Complete Deal
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2.5 px-6">
                Confirm completion only after receiving your meal. Tokens are held in escrow.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 px-4 flex flex-col gap-4 pb-4 overflow-y-auto">
          <div className="flex justify-center my-2">
            <div className="bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200/50">
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                5.0 Tokens locked in escrow
              </p>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Today 08:42 AM</p>
          
          <div className="flex items-end gap-2 max-w-[85%]">
             <img src="https://picsum.photos/seed/alex/100" className="w-7 h-7 rounded-full object-cover mb-1" alt="" />
             <div className="bg-[#EBF2FA] text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none text-[14px] leading-relaxed shadow-sm">
                Hey! I'm outside the dining hall near the tray return area. Wearing a grey NUS hoodie.
             </div>
          </div>

          <div className="flex items-end gap-2 max-w-[85%] self-end flex-row-reverse">
             <img src="https://picsum.photos/seed/me/100" className="w-7 h-7 rounded-full object-cover mb-1" alt="" />
             <div className="bg-nus-blue text-white px-4 py-2.5 rounded-2xl rounded-br-none text-[14px] leading-relaxed shadow-sm">
                On my way! Give me 2 minutes, just leaving my room now.
             </div>
          </div>

          <div className="flex items-end gap-2 max-w-[85%]">
             <img src="https://picsum.photos/seed/alex/100" className="w-7 h-7 rounded-full object-cover mb-1" alt="" />
             <div className="bg-[#EBF2FA] text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none text-[14px] leading-relaxed shadow-sm">
                No worries, take your time! I've already tapped for you.
             </div>
          </div>

          <div className="flex items-end gap-2 self-end max-w-[70%] flex-row-reverse">
             <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-md">
               <img src="https://picsum.photos/seed/proof/300/200" alt="Proof" className="w-full h-32 object-cover" />
               <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                 <p className="text-[10px] text-white font-medium">Delivered</p>
               </div>
             </div>
          </div>

          <div className="flex justify-center my-2">
            <div className="bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">
              <p className="text-[11px] text-nus-orange font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">stars</span>
                Alex is waiting for your confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-slate-100 p-4 pb-8">
           <div className="flex items-center gap-3">
             <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100">
               <span className="material-symbols-outlined">add</span>
             </button>
             <div className="relative flex-1">
               <input type="text" placeholder="Message Alex..." className="w-full h-11 bg-slate-100 border-none rounded-2xl px-5 py-2 text-sm focus:ring-2 focus:ring-nus-blue/20 placeholder:text-slate-400 focus:bg-white transition-colors" />
               <button className="absolute right-2 top-1.5 w-8 h-8 bg-nus-blue text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                 <span className="material-symbols-outlined text-lg">arrow_upward</span>
               </button>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};