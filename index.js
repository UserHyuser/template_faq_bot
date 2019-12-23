const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
require('dotenv').config(); // Load config from .env file
const HttpsProxyAgent = require('https-proxy-agent');

const ProcessCallbackQuery = require('./bin/Faq');
const keyboard = require('./bin/keyboard');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
let processCallbackQuery = new ProcessCallbackQuery();

//ToDo: Сделать клавиатуру FAQ, Контакт, Че-нить еще

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, `Здравствуйте! Это пример бота, который может быть ваш.`, {
		reply_markup:{
			keyboard: keyboard, one_time_keyboard: false
		}
	});
});

bot.onText(/\/faq/, (msg) => {
	processCallbackQuery.send_faq_page(bot, msg.chat.id);
});

bot.sendMessage(process.env.ADMIN_ID, "Бот запущен!");

bot.on('callback_query', function (query) {
	processCallbackQuery.process(bot, query);
})

bot.on('contact', (ctx) =>{
	bot.sendContact(process.env.ADMIN_ID, ctx.contact.phone_number, ctx.contact.first_name);
	bot.sendMessage(ctx.chat.id, "Хорошо, с вами свяжутся в ближайшее время :)");
});

/* Интересно, а если в конце поставить .on('message'), то будет норм работать?*/

/*bot.on('message', (ctx)=>{
	console.log('JUST TEXT')
})*/

bot.on('polling_error', (error) => {
	console.log('POOLING ERROR');
	console.log(error);
});

console.log("Bot started...");