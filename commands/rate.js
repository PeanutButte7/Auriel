module.exports = {
	name: "rate",
	description: "Rates a thing from 0 - 10",
	execute(message, args, localCommandConfig) {
		function sample(array) {
			return array[Math.floor(Math.random() * array.length)]
		}
		const randomBoolean = Math.random() <= localCommandConfig.complete_response_probability;
		let response;
		const ratedItem = args[args.length - 1];

		if (ratedItem.localeCompare("sobě", "cz", { sensitivity: "base" }) === 0 || ratedItem.localeCompare("Auriel", "cz", { sensitivity: "base" }) === 0 || ratedItem.localeCompare("sebe", "cz", { sensitivity: "base" }) === 0 || ratedItem.localeCompare("<@!728002398370529469>", "cz", { sensitivity: "base" }) === 0) {
			response = "To jako chceš abych hodnotila sebe? No ty ses asi úplně zbláznil ne?";
		} else if (ratedItem === "`undefined`") {
			response = "Počkej!... to vypadá jako kdyby ses mě snad snažil rozbít! Tohle teda hodnotit nebudu"
		}
		else if (randomBoolean) {
			response = `U ${ratedItem} ${sample(localCommandConfig.complete_responses)}`;
		} else {
			response = `${ratedItem} ${sample(localCommandConfig.template_responses)} ${Math.floor(Math.random() * 11)}/10`;
		}

		message.channel.send(response);
	},
};