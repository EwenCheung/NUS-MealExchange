import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { Marketplace } from './screens/Marketplace';
import { Wallet } from './screens/Wallet';
import { Chat } from './screens/Chat';
import { CreateOffer } from './screens/CreateOffer';
import { Profile } from './screens/Profile';
import { MySwaps } from './screens/MySwaps';
import { Login, SignUp, VerifyEmail } from './screens/Auth';
import { BottomNav } from './components/Navigation';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);
  const [history, setHistory] = useState<Screen[]>([]);
  const [currentDealId, setCurrentDealId] = useState<string | undefined>();
  const { user, loading } = useAuth();

  // All hooks MUST be called before any conditional returns
  useEffect(() => {
    // Redirect to marketplace if already logged in
    if (user && (currentScreen === Screen.LOGIN || currentScreen === Screen.SIGNUP)) {
      setCurrentScreen(Screen.MARKETPLACE);
    }
  }, [user, currentScreen]);

  const navigate = (screen: Screen, dealId?: string) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    if (dealId) {
      setCurrentDealId(dealId);
    }
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((old) => old.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      // Default fallback
      setCurrentScreen(user ? Screen.MARKETPLACE : Screen.LOGIN);
    }
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <Login onLogin={() => navigate(Screen.MARKETPLACE)} onSignUp={() => navigate(Screen.SIGNUP)} />;
      case Screen.SIGNUP:
        return <SignUp onBack={goBack} onContinue={() => navigate(Screen.MARKETPLACE)} onLogin={() => navigate(Screen.LOGIN)} />;
      case Screen.VERIFY_EMAIL:
        return <VerifyEmail onBack={goBack} onVerify={() => navigate(Screen.MARKETPLACE)} />;
      case Screen.MARKETPLACE:
        return <Marketplace onNavigate={navigate} />;
      case Screen.WALLET:
        return <Wallet onNavigate={navigate} />;
      case Screen.CHAT:
        return <Chat onBack={goBack} dealId={currentDealId} />;
      case Screen.CREATE_OFFER:
        return <CreateOffer onBack={goBack} onPost={() => navigate(Screen.MARKETPLACE)} />;
      case Screen.PROFILE:
        return <Profile onBack={goBack} onLogout={() => setCurrentScreen(Screen.LOGIN)} />;
      case Screen.MY_SWAPS:
        return <MySwaps onNavigate={navigate} />;
      default:
        return <Marketplace onNavigate={navigate} />;
    }
  };

  const mainTabs = [Screen.MARKETPLACE, Screen.MY_SWAPS, Screen.PROFILE, Screen.WALLET];
  const shouldShowNav = mainTabs.includes(currentScreen) && user;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-white shadow-2xl relative flex flex-col">
        {renderScreen()}
        {shouldShowNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}