const fetch = require("node-fetch");
const { authorization_header } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
	name: "findPerson",
	description: "Finds a person in user database",
	execute(message, args, localCommandConfig) {
		const lastWord = args[args.length - 1];
		const discordId = lastWord.replace(/[^0-9]/g,"");

		if (discordId === "728002398370529469") {
			message.channel.send("Hej! To jsem já! :)")
			return;
		}

		async function getData(url = "") {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Authorization": authorization_header
				}
			});

			return response.json();
		}

		getData(`https://indian-tv.cz/auriel-api/discord/${discordId}`).then(data => {
			console.log(data.user);
			const user = data.user;
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor("#0099ff")
				.setTitle(user.displayname)
				.setURL(user.profile)
				.setDescription(user.about)
				.setThumbnail(user.avatar)
				.addFields(
					{ name: "Level", value: user.level.toString(), inline: true },
					{ name: "XP", value: user.xp.toString(), inline: true }
				)

			message.channel.send(exampleEmbed);
		})


	},
};