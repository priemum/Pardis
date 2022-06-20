const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const config = require('../../config.json')

// Functions
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const { tempRoyaleGame } = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('royale-join')
        .setDescription(
            'Join the Royale game. Only usable when a Royale game is initiated....'
        )
        .setDefaultPermission(false),

    run: async (client, interaction, args) => {
        try {
            console.log(tempRoyaleGame)
            let description,
                ephemeral = true

            if (
                !tempRoyaleGame['game'] ||
                (await tempRoyaleGame['game'].happening) == true
            ) {
                description = `You don't have permission to do this.`
                ephemeral = true
            } else {
                const players = await tempRoyaleGame['game'].players

                if (players.indexOf(interaction.user.id) == -1) {
                    players.push(interaction.user.id)

                    tempRoyaleGame['game'] = { players, happening: false }

                    description = `<@${interaction.user.id}> joined the Royale! There are currently ${players.length} players in the game!`

                    ephemeral = false
                } else {
                    description = `You had already joined the game!`

                    ephemeral = true
                }
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setTimestamp(),
                ],
                ephemeral,
            })
        } catch (error) {
            console.log(error)
        }
    },
}
