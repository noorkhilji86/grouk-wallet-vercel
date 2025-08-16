// api/index.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

// CORS & JSON
app.use(cors({
  origin: process.env.WEB_APP_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Security headers
app.use((_, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'Grouk Wallet on Vercel');
  next();
});

// ENV
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = (process.env.WEB_APP_URL || 'https://grouk-wallet-vercel.vercel.app').replace(/\/$/, '');

// Telegram Bot (webhook mode)
let bot = null;
let handlersAttached = false;

function attachBotHandlers() {
  if (!bot || handlersAttached) return;
  handlersAttached = true;

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Friend';
    const welcomeMessage = `🚀 Welcome to Grouk Wallet, ${firstName}!

Your secure, independent Solana wallet right here in Telegram.

🔐 Why Choose Grouk Wallet?
✅ Create wallets with 12-word seed phrases
✅ Import existing wallets securely
✅ Send & receive SOL instantly
✅ Transaction history
✅ Your keys, your crypto!

Tap below to open the wallet 👇`;

    bot.sendMessage(chatId, welcomeMessage, {
      reply_markup: {
        inline_keyboard: [[
          { text: '💳 Open Grouk Wallet', web_app: { url: WEB_APP_URL } }
        ], [
          { text: '📖 Help & Guide', callback_data: 'help' },
          { text: '🛡️ Security Info', callback_data: 'security' }
        ], [
          { text: 'ℹ️ About Grouk', callback_data: 'about' }
        ]]
      }
    });
  });

  bot.onText(/\/wallet/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      '💳 **Access Your Grouk Wallet**\n\nYour secure Solana wallet awaits!',
      {
        reply_markup: { inline_keyboard: [[{ text: '💳 Open Grouk Wallet', web_app: { url: WEB_APP_URL } }]] },
        parse_mode: 'Markdown'
      }
    );
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `🆘 **Grouk Wallet Help**

Commands:
/wallet - Open wallet
/help - Help guide
/about - About Grouk Wallet
/security - Security info

Tips:
• Backup your seed phrase safely
• Use strong passwords
• Never share private keys`;
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    const aboutMessage = `ℹ️ **About Grouk Wallet**
• Non-custodial Solana wallet for Telegram Mini Apps
• Built with React + Node
• Client-side key generation & encryption
• Hosted on Vercel (global edge)

Version: 1.0.0`;
    bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/security/, (msg) => {
    const chatId = msg.chat.id;
    const securityMessage = `🛡️ **Security**
• Your keys never leave your device
• AES-256 local encryption
• Zero server-side key storage`;
    bot.sendMessage(chatId, securityMessage, { parse_mode: 'Markdown' });
  });

  bot.on('callback_query', (cb) => {
    const map = {
      help: '📖 Use /help anytime for the full guide.',
      security: '🛡️ Use /security for complete details.',
      about: 'ℹ️ Use /about for technical overview.'
    };
    bot.answerCallbackQuery(cb.id);
    bot.sendMessage(cb.message.chat.id, map[cb.data] || 'Use /help for available commands.');
  });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    if (text.startsWith('/')) return;
    const responses = [
      'Ready to explore Grouk Wallet? Use /wallet 💳',
      'Your Grouk Wallet is just a tap away — /wallet 🚀',
      'Secure your SOL with Grouk Wallet — /wallet 💎',
      'Start your Solana journey — /wallet 🌟',
      'Experience lightning-fast Grouk Wallet — /wallet ⚡'
    ];
    const r = responses[Math.floor(Math.random() * responses.length)];
    bot.sendMessage(chatId, r, { reply_markup: { inline_keyboard: [[{ text: '💳 Open Grouk Wallet', web_app: { url: WEB_APP_URL } }]] } });
  });
}

(async function initBot() {
  if (!BOT_TOKEN) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN not set; bot disabled.');
    return;
  }
  try {
    bot = new TelegramBot(BOT_TOKEN);
    const webhookUrl = `${WEB_APP_URL}/api/webhook`;
    await bot.setWebHook(webhookUrl);
    console.log('🤖 Webhook set ->', webhookUrl);
    attachBotHandlers();
  } catch (e) {
    console.error('❌ Bot init failed:', e.message);
    bot = null;
  }
})();

// INTERNAL route (mounted at /api/* externally by Vercel)
app.post('/webhook', (req, res) => {
  try {
    if (bot) bot.processUpdate(req.body);
    res.sendStatus(200);
  } catch (e) {
    console.error('Webhook error:', e);
    res.sendStatus(200);
  }
});

// Health & info
app.get('/health', (_, res) => {
  res.json({
    status: 'OK',
    message: 'Grouk Wallet Server is LIVE on Vercel!',
    platform: 'Vercel',
    region: process.env.VERCEL_REGION || 'auto',
    timestamp: new Date().toISOString(),
    bot_status: bot ? 'Connected & Running' : 'Disconnected',
    webhook_configured: !!bot
  });
});

app.get('/stats', (_, res) => {
  res.json({
    name: 'Grouk Wallet',
    version: '1.0.0',
    network: 'Solana Mainnet',
    deployment_url: WEB_APP_URL,
    bot_connected: !!bot,
    uptime: process.uptime()
  });
});

app.get('/performance', (_, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    memory_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    region: process.env.VERCEL_REGION || 'auto',
    bot_webhook_status: !!bot
  });
});

app.get('/deployment', (_, res) => {
  res.json({
    platform: 'Vercel',
    deployment_id: process.env.VERCEL_DEPLOYMENT_ID || 'local',
    region: process.env.VERCEL_REGION || 'auto',
    environment: process.env.NODE_ENV || 'development',
    webhook_url: bot ? `${WEB_APP_URL}/api/webhook` : null
  });
});

app.get('/', (_, res) => res.redirect('/api/health'));

// 404
app.use((_, res) => {
  res.status(404).json({
    error: 'Not found',
    available_endpoints: [
      '/api/health',
      '/api/stats',
      '/api/performance',
      '/api/deployment',
      '/api/webhook'
    ]
  });
});

module.exports = serverless(app);
