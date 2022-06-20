const { Client, Intents, Collection } = require('discord.js')
require('dotenv').config()

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})
module.exports = client

// Global Variables
client.aliases = new Collection()
client.events = new Collection()
client.cooldowns = new Collection()
client.slashCommands = new Collection()

// Initializing the project
//Loading files, with the client variable like Command Handler, Event Handler, ...
;['event_handler', 'slash_handler', 'database_handler'].forEach((handler) => {
	require(`./handlers/${handler}`)(client)
})

client.login(process.env.DISCORD_TOKEN)
client.databaseLogin()
