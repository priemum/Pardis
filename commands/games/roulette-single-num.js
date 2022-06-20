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
        .setName('roulette-single-num')
        .setDescription(
            'You lose your bet or win 35X + 5 WL Spots for your faction...'
        )
        .addIntegerOption((option) =>
            option
                .setName('num')
                .setDescription('Number')
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
            const singleNumChoice = await interaction.options.getInteger('num')
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
                            inlineCode(singleNumChoice)
                        )} with ${bold(inlineCode(xpChoice))} XP.`
                    } else {
                        newTable = true
                        await createRouletteTable()

                        description = `<@${
                            interaction.user.id
                        }> initiated Roulette and bet on ${bold(
                            inlineCode(singleNumChoice)
                        )} with ${bold(
                            inlineCode(xpChoice)
                        )} XP, 20 seconds remaining.`
                    }

                    tempRouletteData[interaction.user.id] = {
                        type: 'single-num',
                        singleNumChoice,
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
