const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

app.use(cors({ origin: process.env.WEB_APP_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use((_, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'Grouk Wallet on Vercel');
  next();
});

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = (process.env.WEB_APP_URL || 'https://grouk-wallet-vercel.vercel.app').replace(/\/$/, '');

let bot = null;
let handlersAttached = false;

function attachBotHandlers() {
  if (!bot || handlersAttached) return;
  handlersAttached = true;

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Friend';
    const welcome = `🚀 Welcome to Grouk Wallet, ${firstName}!\n\nNon-custodial Solana wallet right inside Telegram.`;
    bot.sendMessage(chatId, welcome, {
      reply_markup: {
        inline_keyboard: [[
          { text: '💳 Open Grouk Wallet', web_app: { url: WEB_APP_URL } }
        ], [
          { text: '📖 Help', callback_data: 'help' },
          { text: '🛡️ Security', callback_data: 'security' }
        ]]
      }
    });
  });

  bot.onText(/\/help/, (m) => bot.sendMessage(m.chat.id,
    "Commands: /wallet /help /about /security\nTip: back up your seed phrase and keep it private."));

  bot.onText(/\/about/, (m) => bot.sendMessage(m.chat.id,
    "Grouk Wallet — React + Node, non-custodial, hosted on Vercel."));

  bot.onText(/\/wallet/, (m) =>
    bot.sendMessage(m.chat.id, "Open your wallet:", {
      reply_markup: { inline_keyboard: [[{ text: 'Open', web_app: { url: WEB_APP_URL } }]] }
    })
  );

  bot.on('callback_query', (cb) => {
    const t = { help: 'Use /help any time.', security: 'Keys never leave your device.' }[cb.data] || 'Use /help.';
    bot.answerCallbackQuery(cb.id);
    bot.sendMessage(cb.message.chat.id, t);
  });
}

(async function initBot() {
  if (!BOT_TOKEN) { console.warn('⚠️ TELEGRAM_BOT_TOKEN not set'); return; }
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

app.post('/webhook', (req, res) => {
  try { if (bot) bot.processUpdate(req.body); } catch (_) {}
  res.sendStatus(200);
});

app.get('/health', (_, res) => {
  res.json({
    status: 'OK',
    bot: !!bot,
    webhook: bot ? `${WEB_APP_URL}/api/webhook` : null,
    ts: new Date().toISOString()
  });
});

app.get('/', (_, res) => res.redirect('/api/health'));

module.exports = serverless(app);
