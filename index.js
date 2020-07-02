const fs = require("fs");
const Discord = require("discord.js");
const { token, prefix } = require("./config.json");
const commandConfig = require("./commandConfig.json");

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// Run this when the client is ready
client.once("ready", () => {
	console.log("Ready!");
});

// Runs when someone sends a message
client.on("message", message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return; // Exits if message doesn't start with prefix or is sent by a bot

	const args = message.content.slice(prefix.length).split(/ +/); // Slices the message into an array
	let commandName = null;
	let commandIndex = null;

	// Checks if message contains a command
	commandConfig.commands.forEach((command, index) => {
		const requiredTriggers = command.triggers.length;
		let triggersInMessage = 0;

		// Checks message arguments against triggers
		command.triggers.forEach(trigger => {
			args.forEach(arg => {
				// Runs if trigger includes more word varieties
				if (Array.isArray(trigger)){
					console.log("this is an array");
					// eslint-disable-next-line prefer-const
					for (let word of trigger) {
						if (arg.localeCompare(word, "cz", { sensitivity: "base" }) === 0){
							console.log(`Argument ve zprave "${arg}" je stejný jako trigger "${word}" z příkazu ${command.name}`);

							triggersInMessage++;
							break;
						}
					}
				}
				// Runs if trigger is a single word
				else if (arg.localeCompare(trigger, "cz", { sensitivity: "base" }) === 0){
					console.log(`Argument ve zprave "${arg}" je stejný jako trigger "${trigger}" z příkazu ${command.name}`);

					triggersInMessage++;
				}
			});
		});

		// If the message has all necessary triggers then set commandName to its name
		if (triggersInMessage === requiredTriggers){
			commandName = command.name;
			commandIndex = index;
			console.log("Nyni by se mel spustit command" + commandName + commandIndex);
		}
	});

	if (commandName == null) return;
	if (!client.commands.has(commandName)) return; // Returns if command name doesn't exist as a file under ./commands

	// Tries to execute the files execute function in ./commands
	try {
		client.commands.get(commandName).execute(message, commandConfig.commands[commandIndex]);
	} catch (error) {
		console.error(error);
		message.channel.send("Kruci něco se pokazilo... Zase se mi asi rozbil kvantový akumulátor... <@238365367062233089> oprav to!");
	}


	// if (command === 'argumenty') {
	//     if (!args.length) {
	//         return message.channel.send(`Zpráva nemá žádné argumenty :( ${message.author}!`);
	//     }
	//
	//     message.channel.send(`Argumenty: ${args}\nPočet argumentů: ${args.length}`);
	// }
});

// login to Discord with your app's token
client.login(token);
