const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const config = require('../../config.json')
const questions = require('../../data/questions.json')
const shuffleArray = require('../../functions/helpers/shuffleArray')

// Functions
const {
    tempTrialData,
    trialCooldown,
} = require('../../functions/core/createTempData')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('trial')
        .setDescription('Prove your zeal...')
        .setDefaultPermission(false),

    run: async (client, interaction, args) => {
        try {
            let description,
                components,
                inputOptions = [],
                ephemeral = true

            if (trialCooldown.has(interaction.user.id)) {
                description = `You can use this command every 15 minutes.`
                components = []
                ephemeral = true
            } else {
                const { fetchedUser, fetchedFaction } =
                    await getUserFactionPair(interaction)

                const generatedQuestion =
                    questions[Math.floor(Math.random() * questions.length)]

                const tries = 1

                tempTrialData[interaction.user.id] = {
                    fetchedUser,
                    tries,
                    generatedQuestion,
                }

                description = `Question #${tries}\n\n${generatedQuestion.question}`

                const options = shuffleArray(generatedQuestion.options)

                for (let i = 0; i < options.length; i++) {
                    inputOptions.push({
                        label: options[i],
                        description: `Option #${i}`,
                        value: options[i],
                    })
                }

                components = [
                    new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId('trial')
                            .addOptions(inputOptions)
                    ),
                ]

                ephemeral = true
                trialCooldown.add(interaction.user.id)
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
                trialCooldown.delete(interaction.user.id)
            }, 15 * 60 * 1000)
        } catch (error) {
            console.log(error)
        }
    },
}
