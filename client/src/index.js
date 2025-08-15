import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize Telegram WebApp for Grouk Wallet
if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  
  // Configure Grouk Wallet for Telegram
  tg.ready();
  tg.expand();
  
  // Set Grouk Wallet theme
  if (tg.setHeaderColor) {
    tg.setHeaderColor('#9333ea');
  }
  if (tg.setBackgroundColor) {
    tg.setBackgroundColor('#f5f5f5');
  }
  
  // Enable closing confirmation
  tg.enableClosingConfirmation();
  
  console.log('🚀 Grouk Wallet initialized for Telegram');
  console.log('📱 Platform:', tg.platform);
  console.log('🎨 Theme:', tg.colorScheme);
  console.log('👤 User ID:', tg.initDataUnsafe?.user?.id || 'Unknown');
} else {
  console.log('ℹ️ Grouk Wallet running in browser mode');
}

// Performance monitoring for Grouk Wallet
const startTime = performance.now();

// Create root and render Grouk Wallet
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log render time
setTimeout(() => {
  const renderTime = performance.now() - startTime;
  console.log(`⚡ Grouk Wallet rendered in ${renderTime.toFixed(2)}ms`);
}, 0);

// Report Web Vitals for Grouk Wallet performance monitoring
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Enable performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}

// Error boundary for production
window.addEventListener('error', (event) => {
  console.error('🚨 Grouk Wallet Error:', event.error);
  
  // Could send to error reporting service in production
  if (process.env.NODE_ENV === 'production' && window.Telegram?.WebApp) {
    // Send error to bot or analytics
  }
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Grouk Wallet Unhandled Promise:', event.reason);
  event.preventDefault();
});
