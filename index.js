const fs = require("fs");
const Discord = require("discord.js");
const { token } = require("./config.json");
const commandConfig = require("./commandConfig.json");

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

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
	if (message.author.bot) return; // Exits if message is sent by a bot
	if (!message.content.startsWith("Auriel") && (message.mentions.users.size && message.mentions.users.first().id !== "728002398370529469")) return; // Exits if message doesn't start with prefix or mentions Auriel

	const commandInfo = checkForCommand(message); // gets command info from the message
	executeCommand(commandInfo, message);
});

function executeCommand(commandInfo, message) {
	if (commandInfo.name == null) return; // Returns if there is was no command found in the message
	if (!client.commands.has(commandInfo.name)) return; // Returns if command name doesn't exist as a file under ./commands

	// Tries to execute the files execute function in ./commands
	try {
		client.commands.get(commandInfo.name).execute(message, commandInfo.arguments, commandConfig.commands[commandInfo.index]);
		console.log("----------------------------")
	} catch (error) {
		console.error(error);
		message.channel.send("Kruci něco se pokazilo... Zase se mi asi rozbil kvantový akumulátor... <@238365367062233089> oprav to!"); // Tags an administrator if something goes wrong
	}
}

function checkForCommand(message){
	const args = message.content.slice().split(/ +/); // Slices the message into an array
	console.log(args);
	const commandInfo = {name: null, index: null, arguments: args};

	// Checks if message contains a command
	commandConfig.commands.forEach((command, index) => {
		const requiredTriggers = command.triggers.length;
		let triggersInMessage = 0;

		// Checks message arguments against triggers
		command.triggers.forEach(trigger => {
			args.forEach(arg => {
				// Runs if trigger includes more word varieties
				if (Array.isArray(trigger)){
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
		if (triggersInMessage >= requiredTriggers){
			if (command.type === "custom") {
				commandInfo.name = command.name;
			} else {
				commandInfo.name = command.type;
			}

			commandInfo.index = index;
			console.log("Nyni by se mel spustit příkaz " + commandInfo.name + " s indexem " + commandInfo.index);
		}
	});

	return commandInfo;
}

// login to Discord with your app's token
client.login(token);
