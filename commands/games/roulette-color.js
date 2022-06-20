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
        .setName('roulette-color')
        .setDescription(
            'Throw a marble with an old wandering spirit! You lose your bet or win 2X...'
        )
        .addStringOption((option) =>
            option
                .setName('color')
                .setDescription('Color')
                .setRequired(true)
                .addChoice('Black', 'black')
                .addChoice('Red', 'red')
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
            const colorChoice = await interaction.options.getString('color')
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
                            inlineCode(colorChoice)
                        )} with ${bold(inlineCode(xpChoice))} XP.`
                    } else {
                        newTable = true
                        await createRouletteTable()

                        description = `<@${
                            interaction.user.id
                        }> initiated Roulette and bet on ${bold(
                            inlineCode(colorChoice)
                        )} with ${bold(
                            inlineCode(xpChoice)
                        )} XP, 20 seconds remaining.`
                    }

                    tempRouletteData[interaction.user.id] = {
                        type: 'color',
                        colorChoice,
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
