const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')

// Functions
const getRivalFaction = require('../../functions/core/getRivalFaction')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const {
    infiltrateCooldown,
    tempInfiltrateData,
} = require('../../functions/core/createTempData')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('infiltrate')
        .setDescription('Infiltrate your rival faction & retrieve a WL spot!')
        .setDefaultPermission(false),

    run: async (client, interaction, args) => {
        try {
            let description,
                components,
                ephemeral = true

            if (infiltrateCooldown.has(interaction.user.id)) {
                description = `You can use this command every 15 minutes.`
                components = []
                ephemeral = true
            } else {
                const { fetchedUser, fetchedFaction } =
                    await getUserFactionPair(interaction)

                const generatedTeammates = await randomNumberInRange(4, 11)

                let chances = 4

                const fetchedRivalFaction = await getRivalFaction(
                    interaction,
                    fetchedUser
                )

                tempInfiltrateData[interaction.user.id] = {
                    chances,
                    generatedTeammates,
                    fetchedUser,
                    fetchedFaction,
                    fetchedRivalFaction,
                }

                description = `You have ${inlineCode(
                    generatedTeammates
                )} teammates willing to infiltrate ${
                    fetchedUser.faction == 'Reapers'
                        ? `<@&${config.role.trickstersID}>`
                        : `<@&${config.role.reapersID}>`
                } with you!🤺\n\nDo you attack with teammates you have or wait to gather more? Teammates you currently have may leave!`

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('infiltrate-accept')
                            .setLabel(`INFILTRATE`)
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('infiltrate-next')
                            .setLabel('WAIT!')
                            .setStyle('DANGER')
                    ),
                ]

                ephemeral = true

                infiltrateCooldown.add(interaction.user.id)
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setTimestamp(),
                ],
                components,
                ephemeral,
            })

            setTimeout(() => {
                infiltrateCooldown.delete(interaction.user.id)
            }, 15 * 60 * 1000)
        } catch (error) {
            console.log(error)
        }
    },
}
