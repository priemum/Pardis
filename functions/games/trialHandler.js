const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
} = require('discord.js')
const { bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')
const questions = require('../../data/questions.json')
const shuffleArray = require('../helpers/shuffleArray')
const { tempTrialData } = require('../core/createTempData')

module.exports = async function trialHandler(interaction) {
    try {
        const { fetchedUser, tries, generatedQuestion } =
            tempTrialData[interaction.user.id]

        let replyDescription = null,
            description,
            components = [],
            inputOptions = []

        if (tries > 4) {
            description = 'You can dismiss this message.'
            replyDescription = `<@${interaction.user.id}> used ${inlineCode(
                '/trial'
            )}.\n\nThey won the Trial and earn 500XP.`

            fetchedUser.xp += 500
            await fetchedUser.save()
        } else {
            if (interaction.values[0] == generatedQuestion.answer) {
                const newTries = tries + 1
                const newGeneratedQuestion =
                    questions[Math.floor(Math.random() * questions.length)]

                tempTrialData[interaction.user.id] = {
                    fetchedUser,
                    tries: newTries,
                    generatedQuestion: newGeneratedQuestion,
                }

                description = `Question #${newTries}\n\n${newGeneratedQuestion.question}`

                const options = shuffleArray(newGeneratedQuestion.options)

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
            } else {
                description = 'You can dismiss this message.'

                replyDescription = `<@${interaction.user.id}> used ${inlineCode(
                    '/trial'
                )}.\n\nThey lost after ${tries} questions.`
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
