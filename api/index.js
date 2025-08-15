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
• Client-
