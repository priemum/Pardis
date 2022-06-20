const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const config = require('../../config.json')
const playingCardKeys = require('../../data/playingCardKeys.json')
const playingCards = require('../../data/playingCards.json')

// Functions
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const {
    tempBlackjackData,
    blackjackCooldown,
} = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play cards with an old wandering spirit...')
        .addIntegerOption((option) =>
            option
                .setName('xp')
                .setDescription('Amount of XP to bet.')
                .setRequired(true)
                .setMinValue(100)
                .setMaxValue(1000)
        )
        .setDefaultPermission(false),

    run: async (client, interaction, args) => {
        try {
            let description, components
            const xpChoice = await interaction.options.getInteger('xp')

            if (blackjackCooldown.has(interaction.user.id)) {
                description = `You can use this command every 30 seconds.`
                components = []
            } else {
                const { fetchedUser, fetchedFaction } =
                    await getUserFactionPair(interaction)

                if (fetchedUser.xp < 1000) {
                    description = `You don't have enough XP.`
                    components = []
                } else {
                    const playerIndex = await randomNumberInRange(
                        0,
                        playingCardKeys.length
                    )

                    let botIndex = await randomNumberInRange(
                        0,
                        playingCardKeys.length
                    )

                    while (botIndex == playerIndex) {
                        botIndex = await randomNumberInRange(
                            0,
                            playingCardKeys.length
                        )
                    }

                    const playerFirstEmoji = await client.emojis.cache.find(
                        (e) => e.name === playingCardKeys[playerIndex]
                    )

                    const botFirstEmoji = await client.emojis.cache.find(
                        (e) => e.name === playingCardKeys[botIndex]
                    )

                    tempBlackjackData[interaction.user.id] = {
                        fetchedUser,
                        xpChoice,
                        playerCards: [playingCardKeys[playerIndex]],
                        botCards: [playingCardKeys[botIndex]],
                        playerEmojis: [playerFirstEmoji],
                        botEmojis: [botFirstEmoji],
                        playerValue:
                            playingCards[playingCardKeys[playerIndex]].value,
                        botValue: playingCards[playingCardKeys[botIndex]].value,
                    }

                    description = `${bold(
                        'Your Cards'
                    )}\n${playerFirstEmoji}\n\n${bold(
                        'Bot Cards'
                    )}\n${await interaction.guild.emojis.cache.find(
                        (e) => e.name === '1B'
                    )}`

                    components = [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                                .setCustomId('blackjack-stand')
                                .setLabel('STAND')
                                .setStyle('SECONDARY'),
                            new MessageButton()
                                .setCustomId('blackjack-hit')
                                .setLabel('HIT!')
                                .setStyle('DANGER')
                        ),
                    ]

                    blackjackCooldown.add(interaction.user.id)
                }
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setTimestamp(),
                ],
                components,
                ephemeral: true,
            })

            setTimeout(() => {
                blackjackCooldown.delete(interaction.user.id)
            }, 1 * 30 * 1000)
        } catch (error) {
            console.log(error)
        }
    },
}
