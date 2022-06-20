const client = require('../..')

module.exports = async function getReactionRole(channelID, messageID, emoji) {
	try {
		const providedChannel = client.channels.cache.get(channelID)

		const fetchedMessage = await providedChannel.messages.fetch(messageID)

		await fetchedMessage.react(emoji)
	} catch (error) {
		console.log(error)
	}
}
