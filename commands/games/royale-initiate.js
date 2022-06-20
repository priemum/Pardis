const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, inlineCode, bold } = require('@discordjs/builders')
const config = require('../../config.json')

// Functions
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const { tempRoyaleGame } = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('royale-initiate')
        .setDescription('Rumble Royale... Only usable by founders and mods...')
        .setDefaultPermission(false),

    run: async (client, interaction, args) => {
        try {
            let description,
                ephemeral = true,
                image

            if (tempRoyaleGame['game']) {
                description = `A game is already initiated.`
                ephemeral = true
            } else {
                const players = [interaction.user.id]

                tempRoyaleGame['game'] = { players, happening: false }

                description = `<@${
                    interaction.user.id
                }> has initiated a Royale game!\nUse ${inlineCode(
                    '/royale-join'
                )} to enter the game!`

                image = 'https://user-images.githubusercontent.com/45223699/162925178-838ef87e-7eba-48b6-bb74-58b5e480a0d3.gif'
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
        } catch (error) {
            console.log(error)
        }
    },
}
