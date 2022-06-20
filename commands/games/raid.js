const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const config = require('../../config.json')

// Functions
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const { tempRaidData, raidCooldown } = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('raid')
        .setDescription('Raid the depths of the Crypt and earn XP...')
        .setDefaultPermission(true),

    run: async (client, interaction, args) => {
        try {
            let description,
                components,
                ephemeral = false

            if (raidCooldown.has(interaction.user.id)) {
                description = `You can use this command every 3 minutes.`
                components = []
                ephemeral = true
            } else {
                const { fetchedUser, fetchedFaction } =
                    await getUserFactionPair(interaction)

                const generatedRandomXP = await randomNumberInRange(1, 20)

                tempRaidData[interaction.user.id] = {
                    generatedRandomXP,
                    fetchedUser,
                    fetchedFaction,
                }

                description = `You venture into the depths of the Crypt to find some wandering SOULS... 👻\n\nYou can take ${bold(
                    generatedRandomXP
                )} XP. Do you go deeper or return with what you've found?`

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('raid-accept')
                            .setLabel('RETURN')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('raid-next')
                            .setLabel('DEEPER!')
                            .setStyle('DANGER')
                    ),
                ]

                ephemeral = true

                raidCooldown.add(interaction.user.id)
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
                raidCooldown.delete(interaction.user.id)
            }, 3 * 60 * 1000)
        } catch (error) {
            console.log(error)
        }
    },
}
