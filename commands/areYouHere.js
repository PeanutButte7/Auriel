module.exports = {
	name: "areYouHere",
	description: "Checks if Auriel is online",
	execute(message, localCommandConfig) {
		function sample(array) {
			return array[Math.floor(Math.random() * array.length)]
		}

		const response = `${sample(localCommandConfig.template_responses)} ${sample(localCommandConfig.question_responses)}`;
		message.channel.send(response);
	},
};