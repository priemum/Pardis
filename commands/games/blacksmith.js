const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const config = require('../../config.json')

// Functions
const randomNumberInRange = require('../../functions/helpers/randomNumberInRange')
const {
    tempBlacksmithData,
    blacksmithCooldown,
} = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()         
        .setName('blacksmith')
        .setDescription('Visit the Blacksmiths Realm & earn some XP...')
        .setDefaultPermission(true),

    run: async (client, interaction, args) => {
        try {
            let description,
                components,
                ephemeral = true

            if (blacksmithCooldown.has(interaction.user.id)) {
                description = `You can use this command every 3 minutes.`
                components = []
                ephemeral = true
            } else {
                const dwarfNames = [
                    'Austri',
                    'Vestri',
                    'Nordri',
                    'Sudri',
                    'Alviss',
                    'Ivaldi',
                    'Brokkr',
                    'Eitri',
                    'Alfridd',
                    'Berling',
                    'Dvalin',
                    'Andvari',
                    'Grerr',
                    'Hreidmar',
                    'Fjala',
                    'Galar',
                ]

                const { fetchedUser, fetchedFaction } =
                    await getUserFactionPair(interaction)

                const generatedLowerXP =
                    500 - (await randomNumberInRange(1, 499))
                const generatedHigherXP = generatedLowerXP + 500

                const generatedBlacksmith =
                    dwarfNames[Math.floor(Math.random() * dwarfNames.length)]

                let chances = 4

                tempBlacksmithData[interaction.user.id] = {
                    chances,
                    generatedBlacksmith,
                    dwarfNames,
                    generatedLowerXP,
                    generatedHigherXP,
                    fetchedUser,
                }

                description = `You meet ${bold(
                    generatedBlacksmith + ` the Blacksmith`
                )}. They make you an offer to take 500 XP and give you a chance to get between ${bold(
                    generatedLowerXP
                )} and ${bold(
                    generatedHigherXP
                )} XP.\n\nDo you accept? You can meet ${bold(
                    chances
                )} other Blacksmiths before they kick you out of their realm.`

                components = [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('blacksmith-accept')
                            .setLabel('ACCEPT OFFER')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('blacksmith-next')
                            .setLabel('NEXT OFFER!')
                            .setStyle('DANGER')
                    ),
                ]

                ephemeral = true
                blacksmithCooldown.add(interaction.user.id)
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
                blacksmithCooldown.delete(interaction.user.id)
            }, 3 * 60 * 1000)
        } catch (error) {
            console.log(error)
        }
    },
}
