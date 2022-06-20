const client = require('../..')

function lockdownChannel(channel) {
	channel.permissionOverwrites.set([])
	channel.permissionOverwrites.create(channel.guild.roles.everyone, {
		// VIEW_CHANNEL: false,
		SEND_MESSAGES: false,
	})
}

function synchronizeChannel(channel) {
	try {
		if (channel.parent) {
			channel
				.lockPermissions()
				.then(() =>
					console.log(
						'Successfully synchronized permissions with parent channel'
					)
				)
				.catch(console.error)
		} else {
			console.log('This channel is not listed under a category')
		}
	} catch (error) {
		console.log(error)
	}
}

function getChannelByName(name) {
	try {
		return client.channels.cache.filter((item) => item.name === name)
	} catch (error) {
		console.log(error)
	}
}

function getChannelByID(id) {
	try {
		return client.channels.cache.get(id)
	} catch (error) {
		console.log(error)
	}
}

function getAllTextChannels() {
	try {
		return client.channels.cache.filter(
			(item) => item.type === 'GUILD_TEXT'
		)
	} catch (error) {
		console.log(error)
	}
}

function getAllCategories() {
	try {
		return client.channels.cache.filter(
			(item) => item.type === 'GUILD_CATEGORY'
		)
	} catch (error) {
		console.log(error)
	}
}

module.exports = async function getChannels() {
	try {
		// const categories = getAllCategories()
		// const textChannels = getAllTextChannels()
		// console.log(`${channels.size} channels detected`)
		// textChannels.forEach((channel, key) => {
		// 	synchronizeChannel(channel)
		// })
	} catch (error) {
		console.log(error)
	}
}
