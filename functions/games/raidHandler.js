const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')

const randomNumberInRange = require('../helpers/randomNumberInRange')

const { tempRaidData } = require('../core/createTempData')
const { getWinGIF, getLoseGIF } = require('../helpers/getGIF')

module.exports = async function raidHandler(interaction) {
    try {
        const { generatedRandomXP, fetchedUser, fetchedFaction } =
            tempRaidData[interaction.user.id]

        if (interaction.customId === 'raid-accept') {
            // Won
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
                '/raid'
            )}.\n\nThey decided to take ${bold(
                generatedRandomXP
            )} XP and return.`

            const image = await getWinGIF()

            await interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description)
                        .setImage(image ? image : '')
                        .setTimestamp(),
                ],
            })

            fetchedUser.xp += generatedRandomXP
            await fetchedUser.save()
        } else {
            let image
            const generatedDice = await randomNumberInRange(1, 8)

            if (generatedDice > 5) {
                // Lost

                image = await getLoseGIF()

                await interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setColor(config.embed_color)
                            .setDescription(`You can dismiss this message.`)
                            .setTimestamp(),
                    ],
                    components: [],
                })

                const description = `<@${
                    interaction.user.id
                }> used ${inlineCode(
                    '/raid'
                )}.\n\nThey fell into Sentries' ambush and lost all ${inlineCode(
                    generatedRandomXP
                )} gathered XP.`

                await interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(config.embed_color)
                            .setImage(image ? image : '')
                            .setDescription(description)
                            .setTimestamp(),
                    ],
                })
            } else {
                // Continue
                const generatedNewXP =
                    generatedRandomXP +
                    Math.floor(
                        (await randomNumberInRange(50, 125)) *
                            (Math.random() * (2.6 - 1.2) + 1.2)
                    )

                await interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setColor(config.embed_color)
                            .setDescription(
                                `You venture deeper into the depths of the Crypt...\n\nYou can take ${bold(
                                    generatedNewXP
                                )} XP. Do you go deeper or return with what you've found?`
                            )
                            .setTimestamp(),
                    ],
                    components: [
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
                    ],
                })

                tempRaidData[interaction.user.id] = {
                    generatedRandomXP: generatedNewXP,
                    fetchedUser,
                    fetchedFaction,
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}
