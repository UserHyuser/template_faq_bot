const Telegraf = require('telegraf');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
require('dotenv').config(); // Load config from .env file
const HttpsProxyAgent = require('https-proxy-agent');



const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

const ProcessCallbackQuery = require('./bin/callback_query');
let processCallbackQuery = new ProcessCallbackQuery();

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;

	bot.sendMessage(chatId, `Здравствуйте! Это пример бота, который может быть ваш.
	Введите /faq, чтобы увидеть пример FAQ`);
});

bot.onText(/\/faq/, (msg) => {
	const keyboard = processCallbackQuery.keyboard;
	const chatId = msg.chat.id;

	bot.sendMessage(chatId, `#1. Как связаться с автором этого бота?
#2. Можно ли мне заказать такого же бота?
#3. А сколько это будет стоить?
#4. А что по срокам?`, {
		reply_markup:{
			inline_keyboard: keyboard
		}
	});
});

bot.sendMessage(process.env.ADMIN_ID, "Бот запущен!");

bot.on('callback_query', function (query) {
	processCallbackQuery.process(bot, query);
})

bot.on('polling_error', (error) => {
	console.log('POOLING ERROR');
	console.log(error);  // => 'EFATAL'
});

console.log("Bot started...");