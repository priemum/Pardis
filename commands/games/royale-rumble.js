const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const config = require('../../config.json')
const wait = require('timers/promises').setTimeout

// Functions
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const { tempRoyaleGame } = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('royale-rumble')
        .setDescription(
            'Start the Royale game. Only usable by founders and mods...'
        )
        .addIntegerOption((option) =>
            option
                .setName('timestep')
                .setDescription(
                    'Timestep of players getting removed from the Rumble!'
                )
                .setRequired(true)
                .setMinValue(500)
                .setMaxValue(10000)
        )
        .addIntegerOption((option) =>
            option
                .setName('winners')
                .setDescription('How many players win the game!')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)
        )
        .setDefaultPermission(false),

    run: async (client, interaction, args) => {
        try {
            console.log(tempRoyaleGame)
            const timestep = await interaction.options.getInteger('timestep')
            const winners = await interaction.options.getInteger('winners')

            let description,
                ephemeral = true,
                happening = false,
                image

            if (!tempRoyaleGame['game']) {
                description = `No game is initiated.`
                ephemeral = true
            } else {
                const players = await tempRoyaleGame['game'].players

                happening = true
                tempRoyaleGame['game'] = { players, happening }

                description = `Royale Rumble join period has ended!\n\n<@${interaction.user.id}> has STARTED the Royale Rumble with total players count of ${players.length}!`

                image = 'https://user-images.githubusercontent.com/45223699/162925301-b0f1a18d-ce98-45f5-9a26-cfce6c981e0b.gif'
                ephemeral = false
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setImage(image ? image : '')
                        .setTimestamp(),
                ],
                ephemeral,
            })

            while (
                tempRoyaleGame['game'] &&
                (await tempRoyaleGame['game'].happening)
            ) {
                console.log(tempRoyaleGame)

                await wait(timestep)

                const players = await tempRoyaleGame['game'].players

                if (players.length > winners) {
                    const removedIndex = Math.floor(
                        Math.random() * players.length
                    )

                    const removedPlayer = players[removedIndex]

                    players.splice(removedIndex, 1)

                    tempRoyaleGame['game'] = { players, happening: true }

                    await interaction.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(config.embed_color)
                                .setDescription(
                                    `<@${removedPlayer}> has been removed from the Rumble!`
                                )
                                .setTimestamp(),
                        ],
                    })
                } else {
                    tempRoyaleGame['game'] = null

                    await interaction.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(config.embed_color)
                                .setDescription(
                                    `Rumble has ended! Winner is <@${players[0]}>!`
                                )
                                .setTimestamp(),
                        ],
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
}
