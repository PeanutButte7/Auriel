module.exports = {
	name: "simpleQuestion",
	description: "Template for random answers to simple questions",
	execute(message, args, localCommandConfig) {
		function sample(array) {
			return array[Math.floor(Math.random() * array.length)]
		}

		const randomBoolean = Math.random() <= localCommandConfig.complete_response_probability;
		let response;

		if (randomBoolean){
			response = sample(localCommandConfig.complete_responses);
		} else {
			response = `${sample(localCommandConfig.template_responses)} ${sample(localCommandConfig.question_responses)}`;
		}

		message.channel.send(response);
	},
};