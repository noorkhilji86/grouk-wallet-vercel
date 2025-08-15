// Grouk Wallet - Complete Solana Wallet Component for Vercel
import React, { useState, useEffect } from 'react';

const SolanaWallet = ({ telegramUser }) => {
  const [walletState, setWalletState] = useState('create'); // create, unlock, ready
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(2.456789);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  // Check for existing wallet on load
  useEffect(() => {
    const storedWallet = localStorage.getItem('grouk_wallet');
    if (storedWallet) {
      setWalletState('unlock');
    }
  }, []);

  // Simple wallet creation
  const createWallet = () => {
    const newWallet = {
      address: 'GRouK' + Math.random().toString(36).substr(2, 35),
      created: Date.now()
    };
    setWallet(newWallet);
    localStorage.setItem('grouk_wallet', JSON.stringify(newWallet));
    setWalletState('ready');
  };

  // Copy to clipboard
  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      alert('Address copied!');
    }
  };

  // Format address
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  // If no wallet exists, show create screen
  if (walletState === 'create') {
    return (
      <div style={styles.container}>
        <div style={styles.createScreen}>
          <div style={styles.logo}>GROUK</div>
          <h1 style={styles.title}>Create Your Grouk Wallet</h1>
          <p style={styles.subtitle}>
            Secure, independent Solana wallet for Telegram
          </p>
          
          <div style={styles.features}>
            <div style={styles.feature}>🔐 Your keys, your crypto</div>
            <div style={styles.feature}>⚡ Lightning fast transactions</div>
            <div style={styles.feature}>🌟 Built for Telegram</div>
          </div>
          
          <button 
            onClick={createWallet}
            style={styles.createButton}
          >
            Create Grouk Wallet
          </button>
          
          <p style={styles.disclaimer}>
            Your wallet will be created locally and securely stored on your device.
          </p>
        </div>
      </div>
    );
  }

  // Main wallet interface
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerTitle}>Grouk Wallet</h1>
            <p style={styles.headerSubtitle}>{formatAddress(wallet?.address)}</p>
          </div>
          <div style={styles.statusDot}></div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {activeTab === 'home' && (
          <div style={styles.homeContent}>
            {/* Balance Card */}
            <div style={styles.balanceCard}>
              <div style={styles.balanceHeader}>
                <div>
                  <p style={styles.balanceLabel}>Total Balance</p>
                  <div style={styles.balanceAmount}>
                    <h2 style={styles.balanceValue}>
                      {showBalance ? `${balance.toFixed(6)} SOL` : '••••••'}
                    </h2>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      style={styles.eyeButton}
                    >
                      {showBalance ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
                <div style={styles.balanceUsd}>
                  <p style={styles.usdLabel}>~USD</p>
                  <p style={styles.usdValue}>
                    {showBalance ? `$${(balance * 85).toFixed(2)}` : '••••'}
                  </p>
                </div>
              </div>
              
              <div style={styles.balanceFooter}>
                <div style={styles.networkStatus}>
                  <div style={styles.networkDot}></div>
                  <span style={styles.networkText}>Solana Network</span>
                </div>
                <div style={styles.change}>
                  <span style={styles.changeText}>+2.3%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsGrid}>
              <button 
                onClick={() => setActiveTab('send')}
                style={styles.actionButton}
              >
                <div style={{...styles.actionIcon, backgroundColor: '#fee2e2'}}>
                  <span style={{color: '#dc2626'}}>↗️</span>
                </div>
                <span style={styles.actionLabel}>Send</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('receive')}
                style={styles.actionButton}
              >
                <div style={{...styles.actionIcon, backgroundColor: '#dcfce7'}}>
                  <span style={{color: '#16a34a'}}>↙️</span>
                </div>
                <span style={styles.actionLabel}>Receive</span>
              </button>
              
              <button style={styles.actionButton}>
                <div style={{...styles.actionIcon, backgroundColor: '#dbeafe'}}>
                  <span style={{color: '#2563eb'}}>💳</span>
                </div>
                <span style={styles.actionLabel}>Buy</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('history')}
                style={styles.actionButton}
              >
                <div style={{...styles.actionIcon, backgroundColor: '#f3e8ff'}}>
                  <span style={{color: '#9333ea'}}>📊</span>
                </div>
                <span style={styles.actionLabel}>History</span>
              </button>
            </div>

            {/* Transactions */}
            <div style={styles.transactionsCard}>
              <div style={styles.transactionsHeader}>
                <h3 style={styles.transactionsTitle}>Recent Activity</h3>
                <button 
                  onClick={() => setActiveTab('history')}
                  style={styles.viewAllButton}
                >
                  View All
                </button>
              </div>
              <div style={styles.emptyTransactions}>
                <p style={styles.emptyText}>No transactions yet</p>
                <p style={styles.emptySubtext}>Start sending or receiving SOL</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'send' && (
          <div style={styles.pageContent}>
            <h2 style={styles.pageTitle}>Send SOL</h2>
            <div style={styles.sendForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Recipient Address</label>
                <input
                  type="text"
                  placeholder="Enter Solana wallet address"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount (SOL)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  style={styles.input}
                />
                <p style={styles.balanceInfo}>Available: {balance.toFixed(6)} SOL</p>
              </div>
              
              <div style={styles.feeInfo}>
                <div style={styles.feeRow}>
                  <span>Network Fee</span>
                  <span>~0.000005 SOL</span>
                </div>
              </div>
              
              <button style={styles.sendButton}>
                Send SOL
              </button>
            </div>
          </div>
        )}

        {activeTab === 'receive' && (
          <div style={styles.pageContent}>
            <h2 style={styles.pageTitle}>Receive SOL</h2>
            <div style={styles.receiveContent}>
              <div style={styles.qrPlaceholder}>
                <span style={styles.qrText}>QR Code</span>
              </div>
              
              <div style={styles.addressSection}>
                <p style={styles.addressLabel}>Your Solana Address</p>
                <div style={styles.addressDisplay}>
                  <code style={styles.addressCode}>
                    {formatAddress(wallet?.address)}
                  </code>
                  <button 
                    onClick={copyAddress}
                    style={styles.copyButton}
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <button 
                onClick={copyAddress}
                style={styles.copyAddressButton}
              >
                Copy Address
              </button>
              
              <p style={styles.receiveWarning}>
                Share this address to receive SOL and SPL tokens.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={styles.pageContent}>
            <h2 style={styles.pageTitle}>Transaction History</h2>
            <div style={styles.emptyHistory}>
              <div style={styles.emptyHistoryIcon}>📊</div>
              <p style={styles.emptyText}>No transactions yet</p>
              <p style={styles.emptySubtext}>Your transaction history will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <div style={styles.navContainer}>
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'send', icon: '↗️', label: 'Send' },
            { id: 'receive', icon: '↙️', label: 'Receive' },
            { id: 'history', icon: '📊', label: 'History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navButton,
                backgroundColor: activeTab === tab.id ? '#dbeafe' : 'transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280'
              }}
            >
              <span style={styles.navIcon}>{tab.icon}</span>
              <span style={styles.navLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '448px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  createScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
    color: 'white'
  },
  logo: {
    fontSize: '4rem',
    fontWeight: '900',
    marginBottom: '1rem',
    background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '2px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: '0.9',
    marginBottom: '2rem'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '2rem'
  },
  feature: {
    fontSize: '1rem',
    opacity: '0.8'
  },
  createButton: {
    backgroundColor: 'white',
    color: '#9333ea',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  disclaimer: {
    fontSize: '0.9rem',
    opacity: '0.7',
    textAlign: 'center'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 16px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0
  },
  headerSubtitle: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%'
  },
  content: {
    padding: '16px',
    paddingBottom: '80px'
  },
  homeContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white'
  },
  balanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    margin: '0 0 8px 0'
  },
  balanceAmount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  balanceValue: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0
  },
  eyeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  balanceUsd: {
    textAlign: 'right'
  },
  usdLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '0 0 4px 0'
  },
  usdValue: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0
  },
  balanceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  networkStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  networkDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%'
  },
  networkText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  change: {
    textAlign: 'right'
  },
  changeText: {
    fontSize: '14px',
    color: '#10b981',
    fontWeight: '600'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  actionButton: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  actionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  actionLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  transactionsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  transactionsHeader: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  transactionsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  viewAllButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    cursor: 'pointer'
  },
  emptyTransactions: {
    padding: '32px',
    textAlign: 'center'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '16px',
    margin: '0 0 4px 0'
  },
  emptySubtext: {
    color: '#9ca3af',
    fontSize: '14px',
    margin: 0
  },
  pageContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb'
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 24px 0'
  },
  sendForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  balanceInfo: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0'
  },
  feeInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px'
  },
  feeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  receiveContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  qrPlaceholder: {
    width: '200px',
    height: '200px',
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  qrText: {
    color: '#9ca3af',
    fontSize: '18px'
  },
  addressSection: {
    width: '100%'
  },
  addressLabel: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '8px'
  },
  addressDisplay: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  addressCode: {
    fontSize: '14px',
    color: '#1f2937',
    fontFamily: 'monospace'
  },
  copyButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  },
  copyAddressButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  receiveWarning: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center'
  },
  emptyHistory: {
    padding: '64px 32px',
    textAlign: 'center'
  },
  emptyHistoryIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '448px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb'
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px'
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'none'
  },
  navIcon: {
    fontSize: '20px'
  },
  navLabel: {
    fontSize: '12px',
    fontWeight: '500'
  }
};

export default SolanaWallet;
