const fs = require('fs');
module.exports = class Faq {
	constructor() {
		this.page_number = 0;
		this.question_number = 1;
		this.update_keyboard();

		this.get_questions();
	}

	update_keyboard() {
		this.keyboard = [
			[
				{
					text: 'Вопрос #' + this.question_number,
					callback_data: this.question_number
				},
				{
					text: 'Вопрос #' + (1 + this.question_number),
					callback_data: this.question_number + 1
				}
			],
			[
				{
					text: 'Вопрос #' + (2 + this.question_number),
					callback_data: this.question_number + 2
				},
				{
					text: 'Вопрос #' + (3 + this.question_number),
					callback_data: this.question_number + 3
				}
			],
			[
				{
					text: 'Следущие вопросы',
					callback_data: 'faq_next_question_' + this.page_number
				}
			]
		];
	}

	get_questions() {
		fs.readFile('./faq/questions.txt', 'UTF-8', (err, data) => {
			if (err) console.log(err);
			this.questions = data.split(`\r\n`);
		})
	}

	get_question(number) {
		return this.questions[number];
	}

	get_page(page_number) {
		let page = [];
		try {
			for (let i = 0; i < 4; i++) {
				if (this.questions[(page_number * 4) + i] === undefined) throw 'Question is over';
				page.push(`#${(page_number * 4) + i + 1}. ` + this.questions[(page_number * 4) + i])
			}
		} catch (e) {
			if (page.length === 0) {
				this.page_number = 0;
				this.question_number = 1;
				this.update_keyboard();
				return this.get_page(this.page_number);
			}
			return page
		}
		return page
	}

	process(bot, query) {
		const {chat, message_id, text} = query.message;
		fs.readdir("./faq", function (err, files) { // Count files in faq
			let amount = files.length;
		});

		if (parseInt(query.data).toString() === query.data) {
			let question = `#${query.data}. ` + this.get_question(query.data - 1)
			fs.readFile(`./faq/${query.data}.txt`, 'UTF-8', function (err, answer) {
				if (err) {
					if (err.code === 'ENOENT') {
						bot.sendMessage(chat.id, 'По данному вопросу Вам нужно обратиться напрямую к :').then(function () {
							bot.sendContact(chat.id, '+79130535978', 'Автор бота')
						})
					}
				} else {
					answer = question + `\r\n` + answer;
					answer += "\n\nОстальные вопросы: /faq";
					bot.sendMessage(chat.id, answer)
				}
			})
		} else if (query.data.slice(0, 'faq_next_question_'.length) === 'faq_next_question_') {
			this.page_number++;
			this.question_number += 4;
			this.update_keyboard();
			this.send_faq_page(bot, chat.id)
		} else {
			bot.sendMessage(chat.id, process.env.ERR_MSG)
		}

		bot.answerCallbackQuery({
			callback_query_id: query.id
		})
	}

	send_faq_page(bot, id) {
		let text = this.get_page(this.page_number).join(`\r\n`);
		bot.sendMessage(id, text, {
			reply_markup: {
				inline_keyboard: this.get_right_keyboard(this.page_number)
			}
		});
	}

	get_right_keyboard(page_num) {
		let amount = this.questions.length;
		let amount_to_show = 4;
		if ((page_num * 4 + 4) > amount) {
			amount_to_show = amount % 4;
		}
		if (amount_to_show === 2) {
			return [this.keyboard[0], this.keyboard[2]]
		} else if (amount_to_show === 4)
			return this.keyboard;

		console.error('ERROR: Количество вопросов должно быть кратно 2-м!')
	}
};