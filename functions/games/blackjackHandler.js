const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')

const randomNumberInRange = require('../helpers/randomNumberInRange')
const checkRole = require('../../functions/core/checkRole')

const { tempBlackjackData } = require('../core/createTempData')
const playingCardKeys = require('../../data/playingCardKeys.json')
const playingCards = require('../../data/playingCards.json')

module.exports = async function blackjackHandler(interaction) {
    try {
        const {
            fetchedUser,
            xpChoice,
            playerCards,
            botCards,
            playerEmojis,
            botEmojis,
            playerValue,
            botValue,
        } = tempBlackjackData[interaction.user.id]

        let newPlayerValue,
            newBotValue,
            replyDescription,
            description,
            components = []

        async function getBackCards() {
            let array = []
            const backCard = await interaction.guild.emojis.cache.find(
                (e) => e.name === '1B'
            )

            for (let i = 0; i < botEmojis.length; i++) {
                array.push(backCard)
            }

            return array
        }

        async function serveTable() {
            let playerIndex = await randomNumberInRange(
                0,
                playingCardKeys.length
            )
            let playerNextCard = playingCardKeys[playerIndex]

            while (
                playerCards.indexOf(playerNextCard) != -1 ||
                botCards.indexOf(playerNextCard) != -1
            ) {
                playerIndex = await randomNumberInRange(
                    0,
                    playingCardKeys.length
                )
                playerNextCard = playingCardKeys[playerIndex]
            }

            playerCards.push(playerNextCard)
            newPlayerValue =
                playerValue + playingCards[playingCardKeys[playerIndex]].value

            let botIndex = await randomNumberInRange(0, playingCardKeys.length)
            let botNextCard = playingCardKeys[botIndex]

            while (
                playerCards.indexOf(botNextCard) != -1 ||
                botCards.indexOf(botNextCard) != -1
            ) {
                botIndex = await randomNumberInRange(0, playingCardKeys.length)
                botNextCard = playingCardKeys[botIndex]
            }

            botCards.push(botNextCard)
            newBotValue =
                botValue + playingCards[playingCardKeys[botIndex]].value

            playerNextEmoji = await interaction.guild.emojis.cache.find(
                (e) => e.name === playingCardKeys[playerIndex]
            )

            playerEmojis.push(playerNextEmoji)

            botNextEmoji = await interaction.guild.emojis.cache.find(
                (e) => e.name === playingCardKeys[botIndex]
            )

            botEmojis.push(botNextEmoji)

            tempBlackjackData[interaction.user.id] = {
                fetchedUser,
                xpChoice,
                playerCards,
                botCards,
                playerEmojis,
                botEmojis,
                playerValue: newPlayerValue,
                botValue: newBotValue,
            }
        }

        if (interaction.customId === 'blackjack-stand') {
            const wonReply = `<@${interaction.user.id}> used ${inlineCode(
                '/blackjack'
            )}.\n\n${bold('Their Cards:')}\n${playerEmojis}\n\n${bold(
                'Bot Cards:'
            )}\n${botEmojis}\n\n<@${
                interaction.user.id
            }> WON & earned ${inlineCode(xpChoice)} XP.`

            const lostReply = `<@${interaction.user.id}> used ${inlineCode(
                '/blackjack'
            )}.\n\n${bold('Their Cards:')}\n${playerEmojis}\n\n${bold(
                'Bot Cards:'
            )}\n${botEmojis}\n\n<@${interaction.user.id}> LOST ${inlineCode(
                xpChoice
            )} XP.`

            if (botValue == 21) {
                description = 'Bot won!'
                replyDescription = lostReply

                fetchedUser.xp -= xpChoice
            } else if (botValue > 21) {
                description = 'Bot overshot!'
                replyDescription = wonReply

                fetchedUser.xp += xpChoice
            } else {
                if (botValue >= playerValue) {
                    description = `You lost!`
                    replyDescription = lostReply

                    fetchedUser.xp -= xpChoice
                } else {
                    description = `You won!`
                    replyDescription = wonReply

                    fetchedUser.xp += xpChoice
                }
            }

            await fetchedUser.save()
        } else {
            await serveTable()

            const wonReply = `<@${interaction.user.id}> used ${inlineCode(
                '/blackjack'
            )}.\n\n${bold('Their Cards:')}\n${playerEmojis}\n\n${bold(
                'Bot Cards:'
            )}\n${botEmojis}\n\n<@${
                interaction.user.id
            }> WON & earned ${inlineCode(xpChoice)} XP.`

            const lostReply = `<@${interaction.user.id}> used ${inlineCode(
                '/blackjack'
            )}.\n\n${bold('Their Cards:')}\n${playerEmojis}\n\n${bold(
                'Bot Cards:'
            )}\n${botEmojis}\n\n<@${interaction.user.id}> LOST ${inlineCode(
                xpChoice
            )} XP.`

            if (newBotValue == 21) {
                description = 'Bot won! You can dismiss this message.'
                replyDescription = lostReply

                fetchedUser.xp -= xpChoice
            } else if (newBotValue > 21) {
                description = 'Bot overshot! You can dismiss this message.'
                replyDescription = wonReply

                fetchedUser.xp += xpChoice
            } else {
                if (newPlayerValue == 21) {
                    description = 'You won! You can dismiss this message.'
                    replyDescription = wonReply

                    fetchedUser.xp += xpChoice
                } else if (newPlayerValue > 21) {
                    description = 'You overshot! You can dismiss this message.'
                    replyDescription = lostReply

                    fetchedUser.xp -= xpChoice
                } else {
                    const backCards = await getBackCards()

                    replyDescription = null
                    description = `${bold(
                        'Your Cards'
                    )}\n${playerEmojis}\n\n${bold('Bot Cards')}\n${backCards}`

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
                }
            }
        }

        await interaction.update({
            embeds: [
                new MessageEmbed()
                    .setColor(config.embed_color)
                    .setDescription(description)
                    .setTimestamp(),
            ],
            components,
        })

        if (replyDescription != null) {
            await fetchedUser.save()
            
            await interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(replyDescription)
                        .setTimestamp(),
                ],
            })
        }
    } catch (error) {
        console.log(error)
    }
}
