import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const getIconStyle = (screen: Screen) => {
    const isActive = currentScreen === screen;
    return isActive ? "text-nus-blue fill-1" : "text-slate-400";
  };

  const getTextStyle = (screen: Screen) => {
    const isActive = currentScreen === screen;
    return isActive ? "text-nus-blue" : "text-slate-400";
  };

  return (
    <nav className="fixed bottom-0 z-50 w-full max-w-[480px] bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 pt-3 pb-8 flex items-center justify-between">
      <button 
        onClick={() => onNavigate(Screen.MARKETPLACE)} 
        className={`flex flex-col items-center gap-1 ${getTextStyle(Screen.MARKETPLACE)}`}
      >
        <span className={`material-symbols-outlined ${getIconStyle(Screen.MARKETPLACE)}`}>storefront</span>
        <span className="text-[10px] font-bold">Market</span>
      </button>

      <button 
        onClick={() => onNavigate(Screen.MY_SWAPS)} 
        className={`flex flex-col items-center gap-1 ${getTextStyle(Screen.MY_SWAPS)}`}
      >
        <span className={`material-symbols-outlined ${getIconStyle(Screen.MY_SWAPS)}`}>sync_alt</span>
        <span className="text-[10px] font-medium">My Swaps</span>
      </button>

      <button 
        onClick={() => onNavigate(Screen.WALLET)} 
        className={`flex flex-col items-center gap-1 ${getTextStyle(Screen.WALLET)}`}
      >
        <span className={`material-symbols-outlined ${getIconStyle(Screen.WALLET)}`}>account_balance_wallet</span>
        <span className="text-[10px] font-medium">Wallet</span>
      </button>

      <button 
        onClick={() => onNavigate(Screen.PROFILE)} 
        className={`flex flex-col items-center gap-1 ${getTextStyle(Screen.PROFILE)}`}
      >
        <span className={`material-symbols-outlined ${getIconStyle(Screen.PROFILE)}`}>person</span>
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  );
};