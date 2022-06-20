const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')

const randomNumberInRange = require('../helpers/randomNumberInRange')

const { tempBlacksmithData } = require('../core/createTempData')
const { getWinGIF, getLoseGIF } = require('../helpers/getGIF')

module.exports = async function blacksmithHandler(interaction) {
    try {
        const {
            chances,
            generatedBlacksmith,
            dwarfNames,
            generatedLowerXP,
            generatedHigherXP,
            fetchedUser,
        } = tempBlacksmithData[interaction.user.id]

        if (interaction.customId === 'blacksmith-accept') {
            const generatedXP = Math.floor(
                await randomNumberInRange(generatedLowerXP, generatedHigherXP)
            )

            fetchedUser.xp -= 500
            fetchedUser.xp += generatedXP
            await fetchedUser.save()

            await interaction.update({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(`You can dismiss this message.`)
                        .setTimestamp(),
                ],
                components: [],
            })

            const description = `<@${interaction.user.id}> used ${inlineCode(
                '/blacksmith'
            )}.\n\n<@${interaction.user.id}> accepted the offer from ${bold(
                generatedBlacksmith + ` the Blacksmith`
            )} for ${generatedXP} XP. They ${
                generatedXP > 500 ? 'earned' : 'lost'
            } ${inlineCode(Math.abs(generatedXP - 500))} XP.`

            let image

            if (generatedXP > 500) {
                image = await getWinGIF()
            } else {
                image = await getLoseGIF()
            }

            await interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setImage(image ? image : '')
                        .setDescription(description)
                        .setTimestamp(),
                ],
            })

            tempBlacksmithData[interaction.user.id] = {}
        } else {
            const generatedNewBlacksmith =
                dwarfNames[Math.floor(Math.random() * dwarfNames.length)]

            const generatedNewLowerXP =
                500 - (await randomNumberInRange(1, 499))

            const generatedNewHigherXP = generatedNewLowerXP + 500

            newChances = chances - 1

            const description =
                newChances != 0
                    ? `You meet ${bold(
                          generatedNewBlacksmith + ` the Blacksmith`
                      )}. They make you an offer to take 500 XP and give you a chance to get between ${bold(
                          generatedNewLowerXP
                      )} and ${bold(
                          generatedNewHigherXP
                      )} XP.\n\nYou can meet ${bold(
                          newChances
                      )} other Blacksmiths before they kick you out of their realm.`
                    : `The blacksmiths are angry!😡 They've already taken your 500 XP, you can accept this offer to make some of it back.\n\nYou meet ${bold(
                          generatedNewBlacksmith + ` the Blacksmith`
                      )}. They give you a chance to get between ${bold(
                          generatedNewLowerXP
                      )} and ${bold(generatedNewHigherXP)} XP.`

            tempBlacksmithData[interaction.user.id] = {
                chances: newChances,
                generatedBlacksmith: generatedNewBlacksmith,
                dwarfNames,
                generatedLowerXP: generatedNewLowerXP,
                generatedHigherXP: generatedNewHigherXP,
                fetchedUser,
            }

            await interaction.update({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setTimestamp(),
                ],
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('blacksmith-accept')
                            .setLabel('ACCEPT OFFER')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('blacksmith-next')
                            .setLabel('NEXT OFFER')
                            .setDisabled(newChances == 0 ? true : false)
                            .setStyle('DANGER')
                    ),
                ],
                ephemeral: false,
            })
        }
    } catch (error) {
        console.log(error)
    }
}
