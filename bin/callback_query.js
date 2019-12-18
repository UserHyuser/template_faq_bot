const fs = require('fs');

module.exports = class ProcessCallbackQuery{
	constructor(){
		this.keyboard = [
			[
				{
					text: 'Вопрос #1',
					callback_data:'1'
				},
				{
					text: 'Вопрос #2',
					callback_data:'2'
				}
			],
			[
				{
					text: 'Вопрос #3',
					callback_data:'3'
				},
				{
					text: 'Вопрос #4',
					callback_data:'4'
				}
			],
			[
				{
					text: 'Следущие вопросы',
					callback_data:'faq_next_question_1'
				}
			]
		];
	}

	process(bot, query){
		const {chat, message_id, text} = query.message;

		fs.readdir("./faq", function (err, files) { // Count files in faq
			let amount = files.length;
		});

		if(parseInt(query.data).toString() === query.data){
			fs.readFile(`./faq/${query.data}.txt`, 'UTF-8', function (err, answer) {
				if(err) console.log(err);

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
	}
};