const { MessageEmbed } = require('discord.js')
const { bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')
const randomNumberInRange = require('../helpers/randomNumberInRange')
const wait = require('timers/promises').setTimeout

const { tempRouletteGame, tempRouletteData } = require('../core/createTempData')
const UserModel = require('../../database/models/userModel')
const FactionModel = require('../../database/models/factionModel')
const getGIF = require('../helpers/getGIF')

module.exports = {
    createRouletteTable: async function () {
        try {
            const num = await randomNumberInRange(0, 37)

            switch (num) {
                case 0:
                    color = 'green'
                    break
                case 1:
                case 3:
                case 5:
                case 7:
                case 9:
                case 12:
                case 14:
                case 16:
                case 18:
                case 19:
                case 21:
                case 23:
                case 25:
                case 27:
                case 30:
                case 32:
                case 34:
                case 36:
                    color = 'red'
                    break
                case 2:
                case 4:
                case 6:
                case 8:
                case 10:
                case 11:
                case 13:
                case 15:
                case 17:
                case 20:
                case 22:
                case 24:
                case 26:
                case 28:
                case 29:
                case 31:
                case 33:
                case 35:
                    color = 'black'
                    break
            }

            tempRouletteGame['game'] = {
                color,
                num,
            }
        } catch (error) {
            console.log(error)
        }
    },
    resolveRouletteTable: async function (interaction) {
        try {
            await wait(1 * 20 * 1000)

            let winners = '',
                losers = ''

            for (key in tempRouletteData) {
                const fetchedUser = await UserModel.findOne({
                    discordID: key,
                })

                if (fetchedUser && tempRouletteData[key]) {
                    switch (await tempRouletteData[key].type) {
                        case 'color':
                            if (
                                (await tempRouletteData[key].colorChoice) ==
                                tempRouletteGame.game.color
                            ) {
                                const won = tempRouletteData[key].xpChoice * 2

                                winners += `<@${key}> WON ${bold(
                                    inlineCode(won)
                                )} XP.\n`

                                fetchedUser.xp += won
                            } else {
                                const lost = tempRouletteData[key].xpChoice

                                losers += `<@${key}> LOST ${bold(
                                    inlineCode(lost)
                                )} XP.\n`

                                fetchedUser.xp -= lost
                            }

                            break
                        case 'odd-even':
                            break
                        case 'single-num':
                            if (
                                (await tempRouletteData[key].singleNumChoice) ==
                                (await tempRouletteGame.game.num)
                            ) {
                                // Won

                                const fetchedFaction =
                                    await FactionModel.findOne({
                                        name: fetchedUser.faction,
                                    })

                                fetchedFaction.spots += 5
                                await fetchedFaction.save()

                                const image = await getGIF()

                                await interaction.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(config.embed_color)
                                            .setDescription(
                                                `<@${key}> WON! Their faction wins 10 WL spots!`
                                            )
                                            .setImage(image ? image : '')
                                            .setTimestamp(),
                                    ],
                                })

                                const won = tempRouletteData[key].xpChoice * 35

                                winners += `<@${key}> WON ${bold(
                                    inlineCode(won)
                                )} XP.\n`

                                fetchedUser.xp += won
                            } else {
                                // Lost

                                const lost = tempRouletteData[key].xpChoice

                                losers += `<@${key}> LOST ${bold(
                                    inlineCode(lost)
                                )} XP.\n`

                                fetchedUser.xp -= lost
                            }
                            break
                        case 'double-num':
                            if (
                                (await tempRouletteData[key].firstNumChoice) ==
                                    (await tempRouletteGame.game.num) ||
                                (await tempRouletteData[key].secondNumChoice) ==
                                    (await tempRouletteGame.game.num)
                            ) {
                                const won =
                                    (await tempRouletteData[key].xpChoice) * 17

                                winners += `<@${key}> WON ${bold(
                                    inlineCode(won)
                                )} XP.\n`

                                fetchedUser.xp += won
                            } else {
                                const lost = await tempRouletteData[key]
                                    .xpChoice

                                losers += `<@${key}> LOST ${bold(
                                    inlineCode(lost)
                                )} XP.\n`

                                fetchedUser.xp -= lost
                            }
                            break
                        case 'quatruple-num':
                            if (
                                (await tempRouletteData[key].firstNumChoice) ==
                                    (await tempRouletteGame.game.num) ||
                                (await tempRouletteData[key].secondNumChoice) ==
                                    (await tempRouletteGame.game.num) ||
                                (await tempRouletteData[key].thirdNumChoice) ==
                                    (await tempRouletteGame.game.num) ||
                                (await tempRouletteData[key].fourthNumChoice) ==
                                    (await tempRouletteGame.game.num)
                            ) {
                                const won =
                                    (await tempRouletteData[key].xpChoice) * 9

                                winners += `<@${key}> WON ${bold(
                                    inlineCode(won)
                                )} XP.\n`

                                fetchedUser.xp += won
                            } else {
                                const lost = await tempRouletteData[key]
                                    .xpChoice

                                losers += `<@${key}> LOST ${bold(
                                    inlineCode(lost)
                                )} XP.\n`

                                fetchedUser.xp -= lost
                            }
                            break
                    }

                    await fetchedUser.save()
                    tempRouletteData[key] = null
                }
            }

            const description = `The Marble has landed on ${bold(
                inlineCode(await tempRouletteGame.game.num)
            )} & ${bold(inlineCode(tempRouletteGame.game.color))}.\n\n${
                winners != '' ? `Winners:\n${winners}\n` : ''
            }${losers != '' ? `Losers:\n${losers}` : ''}`

            tempRouletteGame['game'] = null

            await interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setTimestamp(),
                ],
            })
        } catch (error) {
            console.log(error)
        }
    },
}
