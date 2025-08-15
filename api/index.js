const express = require('express');
const cors = require('cors');

const app = express();

// Middleware for Vercel
app.use(cors({
  origin: process.env.WEB_APP_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Security headers for Grouk Wallet
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'Grouk Wallet on Vercel');
  next();
});

// Grouk Wallet Bot Setup for Vercel
const TelegramBot = require('node-telegram-bot-api');
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8353300770:AAG_pbUOBCmZjgXvYAl-OLrCgIyfOdrXY28';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://grouk-wallet-vercel.vercel.app';

let bot;
if (BOT_TOKEN && BOT_TOKEN !== 'your_bot_token_here') {
  try {
    // Use webhook instead of polling for Vercel
    bot = new TelegramBot(BOT_TOKEN);
    
    // Set webhook for Vercel
    const webhookUrl = `${WEB_APP_URL}/api/webhook`;
    bot.setWebHook(webhookUrl);
    
    console.log('🤖 Grouk Wallet Bot configured for Vercel');
    console.log('🔗 Webhook URL:', webhookUrl);
    
  } catch (error) {
    console.error('❌ Grouk Bot initialization failed:', error.message);
  }
}

// Webhook endpoint for Telegram
app.post('/api/webhook', (req, res) => {
  if (bot) {
    bot.processUpdate(req.body);
  }
  res.sendStatus(200);
});

// Bot message handlers
if (bot) {
  // Welcome message for Grouk Wallet
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Friend';
    
    const welcomeMessage = `🚀 Welcome to Grouk Wallet, ${firstName}!

Your secure, independent Solana wallet right here in Telegram.

🔐 **Why Choose Grouk Wallet?**
✅ Create wallets with 12-word seed phrases
✅ Import existing wallets securely  
✅ Send & receive SOL instantly
✅ Complete transaction history
✅ Military-grade encryption
✅ Your keys, your crypto!

**Grouk Wallet = Your Gateway to Solana DeFi! 💎**

🚀 **Now running on Vercel for maximum performance!**

Ready to take control of your crypto? 👇`;
    
    bot.sendMessage(chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💳 Open Grouk Wallet',
            web_app: { url: WEB_APP_URL }
          }
        ], [
          {
            text: '📖 Help & Guide',
            callback_data: 'help'
          },
          {
            text: '🛡️ Security Info',
            callback_data: 'security'
          }
        ], [
          {
            text: 'ℹ️ About Grouk',
            callback_data: 'about'
          }
        ]]
      }
    });
  });

  bot.onText(/\/wallet/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💳 **Access Your Grouk Wallet**\n\nYour secure Solana wallet awaits!\n\n⚡ *Powered by Vercel for lightning-fast performance*', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💳 Open Grouk Wallet',
            web_app: { url: WEB_APP_URL }
          }
        ]]
      }
    });
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `🆘 **Grouk Wallet Help Center**

📋 **Available Commands:**
/wallet - Open your Grouk Wallet
/help - Show this help guide
/about - Learn about Grouk Wallet
/security - Security information

🔧 **Grouk Wallet Features:**
• **Create Wallets** - Generate secure 12-word seed phrases
• **Import Wallets** - Use existing mnemonics safely
• **Send SOL** - Transfer to any Solana address
• **Receive SOL** - Get payments with QR codes
• **Transaction History** - Track all your activities
• **Secure Backup** - Export and restore wallets
• **Password Protection** - Local encryption

🔒 **Grouk Security Promise:**
• Private keys NEVER leave your device
• Seed phrases encrypted with YOUR password
• Zero server-side key storage
• Open-source & auditable code

⚡ **Vercel Performance:**
• Global CDN for fastest loading
• Edge functions for instant responses
• 99.99% uptime guarantee
• Automatic scaling worldwide

🌟 **Pro Tips:**
• Always backup your seed phrase safely
• Use strong passwords for encryption
• Never share your private keys
• Keep your Telegram account secure

Need personal support? Contact @noorkhilji519`;
    
    bot.sendMessage(chatId, helpMessage, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💳 Try Grouk Wallet Now',
            web_app: { url: WEB_APP_URL }
          }
        ]]
      }
    });
  });

  bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    const aboutMessage = `ℹ️ **About Grouk Wallet**

Grouk Wallet is a next-generation, non-custodial Solana wallet built specifically for Telegram Mini Apps.

🏗 **Technical Excellence:**
• Built with React.js & Node.js
• Integrated with Solana Web3.js
• Advanced Web Crypto API security
• Telegram Mini App framework
• Mobile-first responsive design
• Lightning-fast performance

⚡ **Vercel Infrastructure:**
• Global CDN distribution
• Edge computing functions
• Automatic SSL certificates
• 99.99% uptime SLA
• Instant deployments
• Real-time analytics

🔐 **Grouk Security Architecture:**
• Client-side key generation
• AES-256 encrypted local storage
• Zero server-side private data
• Cryptographically secure randomness
• Password-based key derivation
• Hardware security module ready

🌐 **Solana Integration:**
• Mainnet-beta network support
• Real-time balance synchronization
• Instant transaction broadcasting
• Full blockchain compatibility
• SPL token support (coming soon)
• DeFi protocol integrations (roadmap)

📊 **Grouk Stats:**
• Version: 1.0.0 (Genesis)
• Network: Solana Mainnet
• Security Model: Non-custodial
• Repository: Open Source
• Creator: @noorkhilji519
• Platform: Vercel Edge Network

🚀 **The Grouk Vision:**
Making Solana DeFi accessible to everyone through Telegram, while maintaining the highest security standards and lightning-fast performance.

Built with ❤️ and ☕ by the Grouk team on Vercel!`;
    
    bot.sendMessage(chatId, aboutMessage, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💳 Experience Grouk Wallet',
            web_app: { url: WEB_APP_URL }
          }
        ]]
      }
    });
  });

  bot.onText(/\/security/, (msg) => {
    const chatId = msg.chat.id;
    const securityMessage = `🛡️ **Grouk Wallet Security**

**Your Security is Our Priority!**

🔐 **How Grouk Protects You:**

**1. Non-Custodial Design**
• Your private keys = Your control
• No central point of failure
• Government-resistant architecture

**2. Local Encryption**
• AES-256 encryption standard
• Password-based key derivation
• Browser secure storage only

**3. Zero Knowledge**
• We never see your private keys
• We never see your seed phrases
• We never see your passwords

**4. Open Source**
• Fully auditable code
• Community-verified security
• No hidden backdoors

**5. Vercel Security**
• Enterprise-grade infrastructure
• Global DDoS protection
• SOC 2 Type II certified
• GDPR compliant

⚠️ **Security Reminders:**
• Backup your seed phrase offline
• Use unique, strong passwords
• Never share private information
• Verify URLs before entering data
• Keep your device updated

🔒 **Grouk Security = Bank-Level Protection**

Questions? Contact @noorkhilji519`;

    bot.sendMessage(chatId, securityMessage, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💳 Secure Access to Grouk Wallet',
            web_app: { url: WEB_APP_URL }
          }
        ]]
      }
    });
  });

  // Handle callback queries
  bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;

    bot.answerCallbackQuery(callbackQuery.id);

    switch (action) {
      case 'help':
        bot.sendMessage(chatId, '📖 Grouk Wallet help guide sent! Use /help anytime for detailed instructions.');
        break;
      case 'security':
        bot.sendMessage(chatId, '🛡️ Grouk Wallet security information sent! Use /security for complete details.');
        break;
      case 'about':
        bot.sendMessage(chatId, 'ℹ️ About Grouk Wallet sent! Use /about for technical specifications.');
        break;
      default:
        bot.sendMessage(chatId, 'Use /help for available Grouk Wallet commands.');
    }
  });

  // Handle any text message
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Skip if it's a command
    if (text && text.startsWith('/')) {
      return;
    }
    
    // Friendly responses
    const responses = [
      "Hey! Ready to explore Grouk Wallet? Use /wallet 💳",
      "Hello! Your Grouk Wallet is just a tap away - /wallet 🚀",
      "Hi there! Secure your SOL with Grouk Wallet - /wallet 💎",
      "Welcome! Start your Solana journey with /wallet 🌟",
      "Hey! Experience lightning-fast Grouk Wallet on Vercel - /wallet ⚡"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    bot.sendMessage(chatId, randomResponse, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💳 Open Grouk Wallet',
            web_app: { url: WEB_APP_URL }
          }
        ]]
      }
    });
  });
}

// API Routes for Grouk Wallet
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Grouk Wallet Server is LIVE on Vercel!',
    bot: '@GroukWallet_bot',
    owner: '@noorkhilji519',
    platform: 'Vercel',
    region: process.env.VERCEL_REGION || 'auto',
    timestamp: new Date().toISOString(),
    bot_status: bot ? 'Connected & Running' : 'Disconnected',
    webhook_configured: !!bot
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    name: 'Grouk Wallet',
    version: '1.0.0',
    platform: 'Vercel Edge Network',
    network: 'Solana Mainnet',
    bot_username: '@GroukWallet_bot',
    owner: '@noorkhilji519',
    deployment_url: WEB_APP_URL,
    region: process.env.VERCEL_REGION || 'global',
    bot_connected: !!bot,
    uptime: process.uptime(),
    memory_usage: process.memoryUsage(),
    features: [
      'wallet_creation', 
      'seed_import', 
      'sol_transfer', 
      'transaction_history', 
      'secure_backup',
      'vercel_edge_functions',
      'global_cdn',
      'auto_scaling'
    ],
    performance: {
      global_cdn: true,
      edge_functions: true,
      auto_scaling: true,
      ssl_enabled: true
    }
  });
});

// Performance monitoring endpoint
app.get('/api/performance', (req, res) => {
  const performanceData = {
    timestamp: new Date().toISOString(),
    server_response_time: process.hrtime(),
    memory_usage: process.memoryUsage(),
    platform: 'Vercel',
    region: process.env.VERCEL_REGION || 'auto',
    bot_webhook_status: !!bot,
    uptime_seconds: process.uptime()
  };
  
  res.json(performanceData);
});

// Deployment info endpoint
app.get('/api/deployment', (req, res) => {
  res.json({
    platform: 'Vercel',
    project: 'Grouk Wallet',
    version: '1.0.0',
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID || 'local',
    region: process.env.VERCEL_REGION || 'auto',
    environment: process.env.NODE_ENV || 'development',
    bot_configured: !!bot,
    webhook_url: bot ? `${WEB_APP_URL}/api/webhook` : null,
    features_enabled: [
      'telegram_bot',
      'webhook_support',
      'global_cdn',
      'auto_scaling',
      'ssl_termination'
    ]
  });
});

// Root endpoint redirect
app.get('/api', (req, res) => {
  res.redirect('/api/health');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Grouk Wallet API error:', err);
  res.status(500).json({ 
    error: 'Grouk Wallet Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    platform: 'Vercel'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    available_endpoints: [
      '/api/health',
      '/api/stats', 
      '/api/performance',
      '/api/deployment',
      '/api/webhook'
    ]
  });
});

// Export for Vercel serverless functions
module.exports = app;
