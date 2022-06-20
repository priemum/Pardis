const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold, inlineCode } = require('@discordjs/builders')
const config = require('../../config.json')

// Models
const UserModel = require('../../database/models/userModel')
const FactionModel = require('../../database/models/factionModel')

module.exports = {
    ...new SlashCommandBuilder()
        .setName('give-xp')
        .setDescription('Only usable by Founders & Mods.')
        .setDefaultPermission(false)
        .addMentionableOption((option) =>
            option
                .setName('user')
                .setDescription('Experience Points')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('xp')
                .setDescription('Experience Points')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('spots')
                .setDescription('Whitelist Spots')
                .setRequired(true)
        ),

    run: async (client, interaction, args) => {
        try {
            let description,
                ephemeral = false

            const xp = interaction.options.getInteger('xp')
            const user = interaction.options.getMentionable('user')
            const spots = interaction.options.getInteger('spots')

            const fetchedUser = await UserModel.findOne({
                discordID: user.user.id,
            })

            if (fetchedUser) {
                const fetchedFaction = await FactionModel.findOne({
                    name: fetchedUser.faction,
                })

                fetchedUser.xp += xp
                await fetchedUser.save()

                fetchedFaction.spots += spots
                await fetchedFaction.save()

                description = `<@${interaction.user.id}> rewarded <@${
                    user.user.id
                }> with ${inlineCode(
                    xp
                )} XP! This brings their XP to ${inlineCode(
                    fetchedUser.xp
                )}!\n\n${
                    fetchedUser.faction == 'Reapers'
                        ? `<@&${config.role.reapersID}>`
                        : `<@&${config.role.trickstersID}>`
                } receives ${inlineCode(spots)} whitelist spots.`
                ephemeral = false
            } else {
                description = `User could not be found.`
                ephemeral = true
            }

            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(description),
                ],
                ephemeral,
            })
        } catch (error) {
            console.log(error)
        }
    },
}
