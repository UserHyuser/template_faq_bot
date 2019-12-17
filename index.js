const Telegraf = require('telegraf');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
require('dotenv').config(); // Load config from .env file
const HttpsProxyAgent = require('https-proxy-agent');

// const keyboard = require('./bin/keyboard'); // Global access

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;

	bot.sendMessage(chatId, `Здравствуйте! Это пример бота, который может быть ваш.
	Введите /faq, чтобы увидеть пример FAQ`);
});

bot.onText(/\/faq/, (msg) => {
	const keyboard = require('./bin/keyboard');
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
	const {chat, message_id, text} = query.message;

	fs.readdir("./faq", function (err, files) { // Count files in faq
		let amount = files.length;
	})

	if(parseInt(query.data).toString() === query.data){
		fs.readFile(`./faq/${query.data}.txt`, 'UTF-8', function (err, answer) {
			if(err) console.log(err)

			else {
				answer += "\n\nОстальные вопросы: /faq";
				bot.sendMessage(chat.id, answer)
			}
		})
	} else{
		bot.sendMessage(chat.id, process.env.ERR_MSG)
	}

	// Pick button as done
	bot.answerCallbackQuery({
		callback_query_id: query.id
	})
})

bot.on('polling_error', (error) => {
	console.log('POOLING ERROR');
	console.log(error.code);  // => 'EFATAL'
});

console.log("Bot started...");