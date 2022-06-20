const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')

// Models
const UserModel = require('../../database/models/userModel')
const FactionModel = require('../../database/models/factionModel')

// Functions
const { leaderboardCooldown } = require('../../functions/core/createTempData')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show your rank in the leadeboard...')
        .setDefaultPermission(true),

    run: async (client, interaction, args) => {
        try {
            let description,
                ephemeral = false

            if (leaderboardCooldown.has(interaction.user.id)) {
                description = `You can use this command every 10 minutes.`
                ephemeral = true
            } else {
                const fetchedFactions = await FactionModel.find()

                const fetchedUser = await UserModel.findOne({
                    discordID: interaction.user.id,
                })

                const fetchedUsers = await UserModel.find({
                    faction: fetchedUser.faction,
                }).sort({ xp: -1 })

                const ranking = fetchedUsers.findIndex(
                    (i) => i.discordID === interaction.user.id
                )

                description = `<@&${config.role.reapersID}> have ${inlineCode(
                    fetchedFactions[0].spots
                )} whitelist spots.\n<@&${
                    config.role.trickstersID
                }> have ${inlineCode(
                    fetchedFactions[1].spots
                )} whitelist spots.\n\nYou currently have ${inlineCode(
                    fetchedUser.xp
                )} XP.\nYour ranking is ${inlineCode(
                    `#${ranking + 1}`
                )} out of ${inlineCode(fetchedUsers.length)} members in ${
                    fetchedUser.faction == 'Reapers'
                        ? `<@&${config.role.reapersID}>`
                        : `<@&${config.role.trickstersID}>`
                }.`

                leaderboardCooldown.add(interaction.user.id)
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description ? description : '')
                        .setTimestamp(),
                ],
                ephemeral,
            })

            setTimeout(() => {
                leaderboardCooldown.delete(interaction.user.id)
            }, 10 * 60 * 1000)
        } catch (error) {
            console.log(error)
        }
    },
}
