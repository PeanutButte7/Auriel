const Discord = require('discord.js');
const commands = require('./commands.json');
const { token, prefix } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content.localeCompare("díky auriel", "en", {sensitivity: "base"}) === 0){
        message.channel.send(`Nemáš zač :heart:`);
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return; // Exits if message doesn't start with prefix or is sent by a bot

    const args = message.content.slice(prefix.length).split(/ +/); // Slices the message into an array
    const command = args.shift().toLowerCase();

    if (command === 'argumenty') {
        if (!args.length) {
            return message.channel.send(`Zpráva nemá žádné argumenty :( ${message.author}!`);
        }

        message.channel.send(`Argumenty: ${args}\nPočet argumentů: ${args.length}`);
    }
});

// login to Discord with your app's token
client.login(token);
