import React, { useState } from 'react';

interface CreateOfferProps {
  onBack: () => void;
  onPost: () => void;
}

export const CreateOffer: React.FC<CreateOfferProps> = ({ onBack, onPost }) => {
  const [tokens, setTokens] = useState(0.7);
  const [offerType, setOfferType] = useState<'GIVE' | 'REQUEST'>('GIVE');

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-primary text-white p-4 pb-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">
            {offerType === 'GIVE' ? 'Create Meal Offer' : 'Request Meal'}
          </h1>
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        
        <div className="px-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-100">Step 1 of 3: {offerType === 'GIVE' ? 'Meal Details' : 'Request Details'}</span>
            <span className="text-sm font-bold text-white">33%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full transition-all duration-500 w-1/3"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Type Toggle */}
        <section>
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
            <button 
              onClick={() => setOfferType('GIVE')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${offerType === 'GIVE' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Give Meal
            </button>
            <button 
              onClick={() => setOfferType('REQUEST')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${offerType === 'REQUEST' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Request Meal
            </button>
          </div>
        </section>

        {/* Location */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <h3 className="text-lg font-bold leading-tight tracking-tight">Select Location</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Eusoff Hall', 'Kent Ridge Hall', 'UTown', 'Temasek Hall', 'Sheares Hall'].map((loc, i) => (
               <button key={loc} className={`flex h-10 items-center justify-center px-4 rounded-xl font-medium transition-all shadow-sm ${i === 0 ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'}`}>
                 {loc}
               </button>
            ))}
          </div>
        </section>

        {/* Meal Period */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <h3 className="text-lg font-bold leading-tight tracking-tight">Meal Period</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
             <div className="flex flex-col items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all cursor-pointer">
               <span className="material-symbols-outlined text-2xl mb-1 text-slate-400">light_mode</span>
               <span className="text-sm font-semibold">Breakfast</span>
             </div>
             <div className="flex flex-col items-center p-3 rounded-xl border-2 border-primary bg-primary/5 transition-all cursor-pointer shadow-sm">
               <span className="material-symbols-outlined text-2xl mb-1 text-primary">sunny</span>
               <span className="text-sm font-bold text-primary">Lunch</span>
             </div>
             <div className="flex flex-col items-center p-3 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all cursor-pointer">
               <span className="material-symbols-outlined text-2xl mb-1 text-slate-400">dark_mode</span>
               <span className="text-sm font-semibold">Dinner</span>
             </div>
          </div>
        </section>

        {/* Token Price */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">token</span>
               <h3 className="text-lg font-bold leading-tight tracking-tight">Token Price</h3>
             </div>
             <div className="bg-amber-accent/10 text-amber-accent px-3 py-1 rounded-full text-xs font-bold border border-amber-accent/20">
                Recommended: 0.7
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-8">
               <span className="text-slate-500 font-medium uppercase text-xs tracking-wider">Set your value</span>
               <div className="flex items-center gap-2">
                 <input 
                   type="text" 
                   value={tokens}
                   readOnly
                   className="w-16 h-10 text-center font-bold text-lg bg-slate-50 border-none rounded-lg text-primary focus:ring-0" 
                 />
                 <span className="font-bold text-slate-400">TOKENS</span>
               </div>
             </div>
             <input 
               type="range" 
               min="0.1" 
               max="2.0" 
               step="0.1" 
               value={tokens}
               onChange={(e) => setTokens(parseFloat(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
             />
             <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
               <span>0.1</span>
               <span>1.0</span>
               <span>2.0</span>
             </div>
           </div>

           <div className="bg-amber-accent/10 border-l-4 border-amber-accent p-4 rounded-r-xl flex gap-3 items-start">
             <span className="material-symbols-outlined text-amber-accent text-xl">info</span>
             <p className="text-sm text-slate-700 leading-relaxed">
               <span className="font-bold text-slate-900">Pro Tip:</span> Hall meals usually go for <span className="text-amber-accent font-bold">0.7 tokens</span>. Setting this price increases your chance of a quick match!
             </p>
           </div>
        </section>

        {/* Summary */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500 mb-1">Offer Summary</p>
          <p className="text-slate-900 font-semibold">
            {offerType === 'GIVE' ? 'Giving' : 'Requesting'} 1 <span className="text-primary font-bold">Lunch</span> at <span className="text-primary font-bold">Eusoff Hall</span> for <span className="text-primary font-bold">{tokens} Tokens</span>
          </p>
        </div>
      </main>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 pb-8 z-50 flex justify-center">
        <div className="w-full max-w-[480px]">
          <button onClick={onPost} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all active:scale-95">
            <span>{offerType === 'GIVE' ? 'Post Offer' : 'Submit Request'}</span>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};