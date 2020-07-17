const fetch = require("node-fetch");
const { authorization_header } = require("../config.json");
const Discord = require("discord.js");
const colorThief = require("colorthief");

module.exports = {
	name: "findReview",
	description: "Find a review from Indian API",
	execute(message, args, localCommandConfig) {
		async function getData(url = "") {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Authorization": authorization_header
				}
			});

			return response.json();
		}

		// Gets name of the game
		let game;
		args.forEach((arg, index) => {
			if (arg.localeCompare("recenze", "cz", { sensitivity: "base" }) === 0){
				game = args.slice(index + 1).join(" ");
			}
		});

		// Returns in case no words are sent after "recenze" keyword
		if (game === ""){
			message.channel.send("Jakou recenzi bys chtěl najít?")
			return;
		}

		// Gets data from the api
		getData(`https://indian-tv.cz/auriel-api/review/${game}`).then(data => {
			const review = data.review;
			// Returns in case no such game was found in the API
			if (!review){
				message.channel.send("Promiň ale tuhle hru jsem nenašla :/ Zkus zadat její jméno přesněji, můj interdimenzionální vyhledávač občas blbne");
				return;
			}

			let imageColor = "#fcfffa";
			if (review.coverImg){
				// Gets main color of the image
				const imageColorPromise = colorThief.getColor(review.coverImg);
				imageColorPromise.then(
					result => {
						imageColor = result;
					},
					error => {
						console.log(error);
					}
				).then(() => {
					createEmbed(review, imageColor)
				});
			} else {
				console.log("Image is undefined");
				createEmbed(review, imageColor)
			}
		});

		function createEmbed(review, imageColor){
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(imageColor)
				.setTitle(`${review.score}/10 - ${review.verdict}`)
				.setAuthor(review.game,"",review.link)
				.setDescription(review.name)
				.setImage(review.coverImg)
				.addFields(
					{ name: "Plusy", value: review.pluses, inline: true },
					{ name: "Mínusy", value: review.minuses, inline: true },
				)
				.setFooter(`${review.reviewer[0].displayname} - Autor recenze`, review.reviewer[0].avatar);

			message.channel.send(exampleEmbed);
		}
	},
};
