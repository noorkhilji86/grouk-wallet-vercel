import React, { useEffect, useState } from 'react';
import SolanaWallet from './components/SolanaWallet';
import './App.css';

function App() {
  const [telegramUser, setTelegramUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Grouk Wallet with Telegram data
    const initializeGroukWallet = () => {
      console.log('🚀 Initializing Grouk Wallet...');
      
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
          setTelegramUser({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            languageCode: user.language_code,
            isPremium: user.is_premium
          });
          
          console.log('👤 Grouk Wallet User:', user.first_name);
        }
        
        // Configure Telegram WebApp for Grouk Wallet
        tg.ready();
        tg.expand();
        
        // Set app colors
        if (tg.setHeaderColor) {
          tg.setHeaderColor('#9333ea');
        }
        
        // Hide main button initially
        tg.MainButton.hide();
        
        // Enable haptic feedback
        if (tg.HapticFeedback) {
          tg.HapticFeedback.impactOccurred('light');
        }
        
        console.log('✅ Grouk Wallet Telegram integration complete');
      } else {
        console.log('ℹ️ Grouk Wallet running in standalone mode');
      }
      
      // Simulate loading time for smooth UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    
    initializeGroukWallet();
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="grouk-loading-screen">
        <div className="grouk-logo-container">
          <div className="grouk-logo">GROUK</div>
          <div className="grouk-tagline">Secure Solana Wallet</div>
        </div>
        <div className="grouk-loading-spinner"></div>
        <div className="grouk-loading-text">
          {telegramUser ? `Welcome ${telegramUser.firstName}!` : 'Loading Grouk Wallet...'}
        </div>
        <div className="grouk-loading-features">
          <div className="feature">🔐 Military-grade encryption</div>
          <div className="feature">⚡ Lightning-fast transactions</div>
          <div className="feature">🌟 Your keys, your crypto</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App grouk-app">
      <SolanaWallet telegramUser={telegramUser} />
    </div>
  );
}

export default App;
