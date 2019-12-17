const Telegraf = require('telegraf');
require('dotenv').config(); // Load config from .env file
const SocksAgent = require('socks-proxy-agent');

console.log("Connecting to proxy...");
let proxy = 'socks://' + process.env.PROXY;
socksAgent = new SocksAgent(proxy, function () {
	console.log("Proxy connected");
});

const bot = new Telegraf(process.env.TELEGRAM_TOKEN,{
	// telegram: {agent: socksAgent}
});

bot.start((ctx) => ctx.reply('Welcome!'));

bot.launch();
console.log("Bot started...")