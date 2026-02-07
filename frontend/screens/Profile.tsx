import React from 'react';
import { useAuth } from '../src/contexts/AuthContext';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack, onLogout }) => {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col pb-24">
      {/* Top Bar */}
      <div className="flex items-center px-4 pt-6 pb-2 justify-between sticky top-0 bg-background-light/80 backdrop-blur-md z-10">
        <div onClick={onBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Profile</h2>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center px-4 py-6 gap-4">
        <div className="relative">
          <img
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.display_name || 'User'}&backgroundColor=137fec`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/10"
          />
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
            <span className="material-symbols-outlined text-[16px] block">verified</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold tracking-tight">{profile?.display_name || 'User'}</h1>
          <div className="flex items-center gap-1.5 mt-1 bg-primary/10 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm font-bold">alternate_email</span>
            <p className="text-primary text-sm font-semibold tracking-wide">{profile?.email || 'u.nus.edu'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2">
        <div className="flex gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-1 flex-col gap-1 items-center justify-center border-r border-slate-100">
            <p className="text-primary text-xl font-bold">{profile?.total_swaps || 0}</p>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Swaps</p>
          </div>
          <div className="flex flex-1 flex-col gap-1 items-center justify-center border-r border-slate-100">
            <p className="text-amber-accent text-xl font-bold">{profile?.token_balance?.toFixed(1) || '0.0'}</p>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Tokens</p>
          </div>
          <div className="flex flex-1 flex-col gap-1 items-center justify-center">
            <div className="flex items-center gap-1 text-amber-accent">
              <p className="text-xl font-bold">{profile?.trust_rating?.toFixed(1) || '5.0'}</p>
              <span className="material-symbols-outlined text-lg fill-1">star</span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Rating</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-1 px-4 mt-6">
        <div className="flex items-center gap-4 bg-white py-3 px-3 rounded-lg cursor-pointer group hover:bg-slate-50 border border-slate-50 shadow-sm">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-10">
            <span className="material-symbols-outlined">edit</span>
          </div>
          <div className="flex flex-1 items-center justify-between h-full">
            <p className="text-base font-semibold">Edit Profile</p>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white py-3 px-3 rounded-lg cursor-pointer group hover:bg-slate-50 border border-slate-50 shadow-sm">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-10">
            <span className="material-symbols-outlined">notifications</span>
          </div>
          <div className="flex flex-1 items-center justify-between h-full">
            <p className="text-base font-semibold">Notifications</p>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white py-3 px-3 rounded-lg cursor-pointer group hover:bg-slate-50 border border-slate-50 shadow-sm">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-10">
            <span className="material-symbols-outlined">help</span>
          </div>
          <div className="flex flex-1 items-center justify-between h-full">
            <p className="text-base font-semibold">Help & Support</p>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </div>

        <div className="mt-4"></div>

        <div
          onClick={handleLogout}
          className="flex items-center gap-4 bg-white py-3 px-3 rounded-lg cursor-pointer group hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm border-slate-50"
        >
          <div className="flex items-center justify-center rounded-lg bg-red-50 text-red-600 shrink-0 size-10">
            <span className="material-symbols-outlined">logout</span>
          </div>
          <div className="flex flex-1 items-center justify-between h-full">
            <p className="text-base font-semibold text-red-600">Logout</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-8 flex flex-col items-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">MealExchange v2.4.0</p>
        <p className="text-slate-300 text-[10px] mt-1">Built for NUS Students</p>
      </div>
    </div>
  );
};