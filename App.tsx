
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import OnboardingScreen from './components/OnboardingScreen';
import MainScreen from './components/MainScreen';
import CuriositiesScreen from './components/CuriositiesScreen';
import Chatbot from './components/Chatbot';
import { ChatbotIcon } from './components/icons/Icons';
import { Screen } from './types';
import AccessibilityMenu from './components/AccessibilityMenu';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    if (currentScreen === Screen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(Screen.LOGIN);
      }, 4000); // Splash screen duration
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SPLASH:
        return <SplashScreen />;
      case Screen.LOGIN:
        return <LoginScreen onNavigate={setCurrentScreen} />;
      case Screen.SIGNUP:
        return <SignUpScreen onNavigate={setCurrentScreen} />;
      case Screen.ONBOARDING:
        return <OnboardingScreen onNavigate={setCurrentScreen} />;
      case Screen.MAIN:
        return <MainScreen onNavigate={setCurrentScreen} />;
      case Screen.CURIOSITIES:
        return <CuriositiesScreen onNavigate={setCurrentScreen} />;
      default:
        return <LoginScreen onNavigate={setCurrentScreen} />;
    }
  };

  const showChatbotButton = [Screen.MAIN, Screen.CURIOSITIES].includes(currentScreen);
  const showAccessibilityButton = currentScreen !== Screen.SPLASH;


  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      {renderScreen()}

      {showAccessibilityButton && <AccessibilityMenu />}

      {showChatbotButton && (
        <button
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-6 right-6 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 z-40"
            aria-label="Abrir assistente de IA"
        >
            <ChatbotIcon />
        </button>
      )}

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
};

export default App;