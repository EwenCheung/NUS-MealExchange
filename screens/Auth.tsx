import React from 'react';

// LOGIN SCREEN
export const Login: React.FC<{ onLogin: () => void; onSignUp: () => void }> = ({ onLogin, onSignUp }) => (
  <div className="flex flex-col h-full min-h-screen bg-white">
    <div className="flex items-center p-6 pb-2 justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-2 rounded-xl text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
        </div>
        <h2 className="text-primary text-xl font-extrabold tracking-tight">MealExchange</h2>
      </div>
      {/* Help icon removed */}
    </div>
    
    <div className="px-6 pt-10 pb-6">
      <h1 className="text-slate-900 text-4xl font-extrabold leading-tight mb-2">Welcome Back!</h1>
      <p className="text-slate-500 text-lg">Sign in to swap your NUS meal credits with fellow students.</p>
    </div>

    <div className="px-6 flex-1">
       <div className="space-y-5">
         <div className="space-y-2">
           <label className="block text-sm font-semibold text-slate-700 ml-1">NUS Email</label>
           <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
               <span className="material-symbols-outlined text-xl">alternate_email</span>
             </div>
             <input type="email" placeholder="e1234567@u.nus.edu" className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
           </div>
         </div>
         <div className="space-y-2">
           <div className="flex justify-between items-center px-1">
             <label className="block text-sm font-semibold text-slate-700">Password</label>
             <button className="text-sm font-semibold text-primary hover:text-primary/80">Forgot Password?</button>
           </div>
           <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
               <span className="material-symbols-outlined text-xl">lock</span>
             </div>
             <input type="password" placeholder="••••••••" className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
             <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400">
               <span className="material-symbols-outlined text-xl">visibility</span>
             </div>
           </div>
         </div>
         
         <div className="pt-4">
           <button onClick={onLogin} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              Sign In
              <span className="material-symbols-outlined">arrow_forward</span>
           </button>
         </div>
       </div>

       <div className="mt-8 flex items-center gap-4 text-slate-300">
         <div className="h-px flex-1 bg-current"></div>
         <span className="text-xs font-bold uppercase tracking-widest text-slate-400">or</span>
         <div className="h-px flex-1 bg-current"></div>
       </div>

       <div className="mt-8 text-center pb-8">
         <p className="text-slate-500 font-medium">
            Don't have an account? 
            <button onClick={onSignUp} className="text-amber-accent font-bold ml-1 hover:underline">Sign Up</button>
         </p>
       </div>
    </div>
    
    <div className="relative mt-auto h-2 bg-gradient-to-r from-primary via-amber-accent to-primary"></div>
  </div>
);

// SIGNUP SCREEN
export const SignUp: React.FC<{ onBack: () => void; onContinue: () => void; onLogin: () => void }> = ({ onBack, onContinue, onLogin }) => (
  <div className="flex flex-col h-full min-h-screen bg-background-light">
    <div className="flex items-center p-4 pb-2 justify-between">
      <button onClick={onBack} className="text-slate-900 flex size-12 shrink-0 items-center justify-start focus:outline-none">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Create account</h2>
    </div>

    <div className="flex w-full flex-row items-center justify-center gap-3 py-4">
      <div className="h-1.5 w-12 rounded-full bg-primary"></div>
      <div className="h-1.5 w-12 rounded-full bg-slate-200"></div>
      <div className="h-1.5 w-12 rounded-full bg-slate-200"></div>
    </div>

    <div className="px-6 pt-6">
      <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight">Join MealExchange</h1>
      <p className="text-slate-600 text-base font-normal leading-normal mt-2">Step 1: Student Verification</p>
    </div>

    <div className="flex flex-col gap-5 px-6 pt-8 flex-1">
      <label className="flex flex-col gap-2">
        <span className="text-slate-900 text-sm font-semibold leading-none">NUS Email Address</span>
        <input type="email" placeholder="e1234567@u.nus.edu" className="flex w-full rounded-xl text-slate-900 border border-slate-200 bg-white h-14 placeholder:text-slate-400 p-4 text-base focus:ring-2 focus:ring-primary focus:border-primary" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-slate-900 text-sm font-semibold leading-none">Create Password</span>
        <div className="relative">
          <input type="password" placeholder="At least 8 characters" className="flex w-full rounded-xl text-slate-900 border border-slate-200 bg-white h-14 placeholder:text-slate-400 p-4 text-base focus:ring-2 focus:ring-primary focus:border-primary" />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <span className="material-symbols-outlined">visibility</span>
          </button>
        </div>
      </label>

      <div className="flex gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 mt-2">
        <div className="text-primary mt-0.5"><span className="material-symbols-outlined text-[20px]">info</span></div>
        <p className="text-sm text-slate-700 leading-snug">
          <span className="font-semibold text-primary">Trust is key.</span> We only support <span className="font-mono text-xs bg-slate-100 px-1 rounded">@u.nus.edu</span> emails.
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2 px-1">
        <span className="material-symbols-outlined text-amber-accent fill-1">verified_user</span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verified Student Marketplace</span>
      </div>
    </div>

    <div className="p-6 flex flex-col gap-4 mt-auto">
      <button onClick={onContinue} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
         Continue
         <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      <p className="text-center text-sm text-slate-500">
         Already have an account? <button onClick={onLogin} className="text-primary font-bold hover:underline">Log in</button>
      </p>
    </div>
  </div>
);

// VERIFY EMAIL SCREEN
export const VerifyEmail: React.FC<{ onBack: () => void; onVerify: () => void }> = ({ onBack, onVerify }) => (
  <div className="flex flex-col h-full min-h-screen bg-background-light">
    <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
      <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-700">
        <span className="material-symbols-outlined">arrow_back_ios_new</span>
      </button>
      <h1 className="text-[#0d141b] text-lg font-bold leading-tight">Verify Your Email</h1>
      <div className="w-10"></div>
    </header>

    <main className="flex-1 flex flex-col px-6 pt-10 pb-8 w-full">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl">mark_email_read</span>
        </div>
      </div>

      <div className="text-left mb-10">
        <h2 className="text-[#0d141b] text-3xl font-bold leading-tight mb-3">Enter OTP Code</h2>
        <p className="text-gray-600 text-base leading-relaxed">
          We've sent a 4-digit verification code to your <span className="text-primary font-semibold">NUS email</span>.
        </p>
      </div>

      <div className="flex justify-between gap-4 mb-10">
        {[0, 1, 2, 3].map(i => (
          <input key={i} className="aspect-square w-full text-center text-3xl font-bold border-2 border-amber-accent bg-white text-[#0d141b] rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm" maxLength={1} placeholder="0" />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mb-auto">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <span className="material-symbols-outlined text-gray-500 text-sm">schedule</span>
          <p className="text-sm font-medium text-gray-600">Resend in <span className="text-primary">00:45</span></p>
        </div>
        <button className="text-primary text-sm font-semibold hover:underline opacity-50 cursor-not-allowed">Didn't receive the code? Resend</button>
      </div>

      <div className="mt-8 space-y-4">
        <button onClick={onVerify} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
          <span>Verify & Join</span>
          <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
        <p className="text-center text-xs text-gray-400">By verifying, you agree to MealExchange's <span className="underline">Terms of Service</span>.</p>
      </div>
    </main>
  </div>
);