const client = require('../..')
const config = require('../../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    sendEmbeddedMessage: async function (channelId, description, image) {
        try {
            const providedChannel = client.channels.cache.get(channelId)

            await providedChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setImage(image ? image : ''),
                ],
            })
        } catch (error) {
            console.log(error)
        }
    },
    sendContentMessage: async function (channelId, content) {
        try {
            const providedChannel = client.channels.cache.get(channelId)

            await providedChannel.send({
                content,
            })
        } catch (error) {
            console.log(error)
        }
    },
}
