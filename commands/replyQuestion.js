module.exports = {
	name: "replyQuestion",
	description: "Template for random answers with replies",
	execute(message, args, localCommandConfig) {
		function sample(array) {
			return array[Math.floor(Math.random() * array.length)]
		}
		console.log("pracuje se na tom")

		const randomBoolean = Math.random() <= localCommandConfig.complete_response_probability;
		let response;

		if (randomBoolean){
			response = `${sample(localCommandConfig.complete_responses)} <@${message.author.id}>`;
		} else {
			response = `${sample(localCommandConfig.template_responses)} ${sample(localCommandConfig.question_responses)} <@${message.author.id}>`;
		}

		message.channel.send(response)
	},
};