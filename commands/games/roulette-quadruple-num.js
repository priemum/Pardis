const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, inlineCode, bold } = require('@discordjs/builders')
const config = require('../../config.json')
const getUserFactionPair = require('../../functions/core/getUserFactionPair')

// Functions
const {
    tempRouletteGame,
    tempRouletteData,
} = require('../../functions/core/createTempData')
const {
    createRouletteTable,
    resolveRouletteTable,
} = require('../../functions/games/rouletteHandler')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('roulette-quadruple-num')
        .setDescription(
            'Throw a marble with an old wandering spirit! You lose your bet or win 9X...'
        )
        .addIntegerOption((option) =>
            option
                .setName('first-num')
                .setDescription('First Number')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(36)
        )
        .addIntegerOption((option) =>
            option
                .setName('second-num')
                .setDescription('Second Number')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(36)
        )
        .addIntegerOption((option) =>
            option
                .setName('third-num')
                .setDescription('Third Number')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(36)
        )
        .addIntegerOption((option) =>
            option
                .setName('fourth-num')
                .setDescription('Fourth Number')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(36)
        )
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
            let description,
                newTable = false
            const firstNumChoice = await interaction.options.getInteger('first-num')
            const secondNumChoice = await interaction.options.getInteger('second-num')
            const thirdNumChoice = await interaction.options.getInteger('third-num')
            const fourthNumChoice = await interaction.options.getInteger('fourth-num')
            const xpChoice = await interaction.options.getInteger('xp')

            const { fetchedUser, fetchedFaction } = await getUserFactionPair(
                interaction
            )

            if (fetchedUser.xp < 1000) {
                description = `You don't have enough XP.`
            } else {
                if (tempRouletteData[interaction.user.id]) {
                    description = 'You have already joined the table.'
                } else {
                    if (tempRouletteGame.game) {
                        description = `<@${
                            interaction.user.id
                        }> joined the Roulette table and bet on ${bold(
                            inlineCode(firstNumChoice)
                        )} & ${bold(
                            inlineCode(secondNumChoice)
                        )} & ${bold(
                            inlineCode(thirdNumChoice)
                        )} & ${bold(
                            inlineCode(fourthNumChoice)
                        )} with ${bold(inlineCode(xpChoice))} XP.`
                    } else {
                        newTable = true
                        await createRouletteTable()

                        description = `<@${
                            interaction.user.id
                        }> initiated Roulette and bet on ${bold(
                            inlineCode(firstNumChoice)
                        )} & ${bold(
                            inlineCode(secondNumChoice)
                        )} & ${bold(
                            inlineCode(thirdNumChoice)
                        )} & ${bold(
                            inlineCode(fourthNumChoice)
                        )} with ${bold(
                            inlineCode(xpChoice)
                        )} XP, 20 seconds remaining.`
                    }

                    tempRouletteData[interaction.user.id] = {
                        type: 'quadruple-num',
                        firstNumChoice,
                        secondNumChoice,
                        thirdNumChoice,
                        fourthNumChoice,
                        xpChoice,
                    }
                }
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setTimestamp(),
                ],
            })

            if (newTable) await resolveRouletteTable(interaction)
        } catch (error) {
            console.log(error)
        }
    },
}
