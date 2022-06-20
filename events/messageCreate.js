const client = require('../index.js')
const config = require('../config.json')
const { naughtyList } = require('../functions/core/createTempData')
const { MessageEmbed } = require('discord.js')

const sensitiveChannels = [
    config.channel.sensitive.welcomeID,
    config.channel.sensitive.faqID,
    config.channel.sensitive.announcementsID,
    config.channel.sensitive.roadmapID,
    config.channel.sensitive.whitelistID,
    config.channel.sensitive.loreID,
    config.channel.sensitive.fusionID,
    config.channel.sensitive.howToPlayID,
    config.channel.sensitive.safetyID,
    config.channel.sensitive.terminologyID,
    config.channel.sensitive.linksID,
    config.channel.sensitive.giveawaysID,
]

async function scan(message) {
    try {
        const guild = client.guilds.cache.get(config.guildID)

        if (
            message.author.id != client.user.id &&
            message.author.id != guild.ownerId
        ) {
            if (
                sensitiveChannels.indexOf(message.channelId) !== -1 ||
                message.content.includes('http') ||
                message.webhookId
            ) {
                if (message.author.id in naughtyList) {
                    if (naughtyList[message.author.id] > 3) {
                        try {
                            const member = message.guild.members.cache.get(
                                message.author.id
                            )

                            member.timeout(
                                1 * 60 * 60 * 1000,
                                'You are on a timeout.'
                            )

                            delete naughtyList[message.author.id]
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        naughtyList[message.author.id]++
                    }
                } else {
                    naughtyList[message.author.id] = 1
                }
                message.delete()

                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(config.embed_color)
                            .setDescription(
                                `You can't send a link in this server.`
                            ),
                    ],
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

client.on('messageCreate', async (message) => {
    try {
        await scan(message)
    } catch (error) {
        console.log(error)
    }
})

client.on('messageUpdate', async function (oldMessage, newMessage) {
    try {
        await scan(newMessage)
    } catch (error) {
        console.log(error)
    }
})
