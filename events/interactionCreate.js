const { MessageEmbed } = require('discord.js')
const client = require('../index.js')
const config = require('../config.json')

// Models
const UserModel = require('../database/models/userModel')

// Embeds
const embedWelcome = require('../embeds/embedWelcome')

// Core Functions
const addRole = require('../functions/core/addRole')
const removeRole = require('../functions/core/removeRole')
const {
    tempInvitees,
    naughtyList,
} = require('../functions/core/createTempData')
const checkRole = require('../functions/core/checkRole')

// Game Functions
const blackjackHandler = require('../functions/games/blackjackHandler')
const blacksmithHandler = require('../functions/games/blackSmithHandler')
const raidHandler = require('../functions/games/raidHandler')
const infiltrateHandler = require('../functions/games/infiltrateHandler')
const trialHandler = require('../functions/games/trialHandler')

client.on('interactionCreate', async (interaction) => {
    try {
        if (
            interaction.channel.id == config.channel.input.commandsID ||
            interaction.channel.id == config.channel.sensitive.welcomeID ||
            (await checkRole(interaction, 'Founders')) ||
            (await checkRole(interaction, 'Mods'))
        ) {
            if (interaction.isCommand()) {
                const cmd = client.slashCommands.get(interaction.commandName)
                if (!cmd)
                    return await interaction.reply({
                        content: 'An error has occured ',
                    })

                // Sub-Commands
                const args = []

                for (let option of interaction.options.data) {
                    if (option.type === 'SUB_COMMAND') {
                        if (option.name) args.push(option.name)
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value)
                        })
                    } else if (option.value) args.push(option.value)
                }

                interaction.member = interaction.guild.members.cache.get(
                    interaction.user.id
                )

                if (cmd) {
                    if (
                        !interaction.member.permissions.has(
                            cmd.permissions || []
                        )
                    ) {
                        return await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(config.embed_color)
                                    .setDescription(
                                        `You don't have ${cmd.permissions} to run this command...`
                                    ),
                            ],
                        })
                    }
                    cmd.run(client, interaction, args)
                }
            }

            if (interaction.isButton()) {
                if (interaction.customId === 'welcome-button') {
                    if (await checkRole(interaction, 'Member')) {
                        if (interaction.user.id in naughtyList) {
                            if (naughtyList[interaction.user.id] > 3) {
                                try {
                                    const member =
                                        interaction.guild.members.cache.get(
                                            interaction.user.id
                                        )

                                    member.timeout(
                                        5 * 60 * 1000,
                                        'You were messaging in a channel reserved for using slash commands.'
                                    )

                                    delete naughtyList[interaction.user.id]
                                } catch (error) {
                                    console.log(error)
                                }
                            } else {
                                naughtyList[interaction.user.id]++
                            }
                        } else {
                            naughtyList[interaction.user.id] = 1
                        }

                        await interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(config.embed_color)
                                    .setDescription(
                                        'You have already completed the initiation process.'
                                    ),
                            ],
                            ephemeral: true,
                        })
                    } else {
                        await interaction.reply({
                            embeds: [await embedWelcome.firstEmbed()],
                            components: [await embedWelcome.firstComponent()],
                            ephemeral: true,
                        })
                    }
                }

                if (interaction.customId === 'welcome-first') {
                    await interaction.update({
                        embeds: [await embedWelcome.secondEmbed()],
                        components: [await embedWelcome.secondComponent()],
                    })
                }

                if (interaction.customId === 'welcome-second') {
                    await interaction.update({
                        embeds: [await embedWelcome.thirdEmbed()],
                        components: [await embedWelcome.thirdComponent()],
                    })
                }

                if (interaction.customId === 'welcome-third') {
                    await interaction.update({
                        embeds: [await embedWelcome.fourthEmbed()],
                        components: [await embedWelcome.fourthComponent()],
                    })
                }

                if (interaction.customId === 'welcome-fourth') {
                    await interaction.update({
                        embeds: [await embedWelcome.fifthEmbed()],
                        components: [await embedWelcome.fifthComponent()],
                    })
                }

                if (interaction.customId === 'welcome-fifth') {
                    let factionRole

                    const fetchedUser = await UserModel.findOne({
                        discordID: interaction.user.id,
                    })

                    if (fetchedUser) {
                        factionRole = fetchedUser.faction

                        if (fetchedUser.xp > 5000) {
                            fetchedUser.xp = 5000

                            await fetchedUser.save()
                        }
                    } else {
                        const index = tempInvitees
                            .map(function (e) {
                                return e.discordID
                            })
                            .indexOf(interaction.user.id)

                        if (index != -1) {
                            factionRole = tempInvitees[index].faction
                        } else {
                            // User didn't exist and wasn't in tempInvitees
                            const roles = ['Reapers', 'Tricksters']

                            factionRole =
                                roles[Math.floor(Math.random() * roles.length)]
                        }

                        await UserModel.create({
                            discordID: interaction.user.id,
                            faction: factionRole,
                        })
                    }

                    await addRole(interaction.user.id, factionRole)
                    await addRole(interaction.user.id, 'Member')

                    await interaction.update({
                        embeds: [await embedWelcome.finalEmbed(factionRole)],
                        components: [],
                    })
                }

                if (
                    interaction.customId === 'blacksmith-accept' ||
                    interaction.customId === 'blacksmith-next'
                ) {
                    await blacksmithHandler(interaction)
                }

                if (
                    interaction.customId === 'raid-accept' ||
                    interaction.customId === 'raid-next'
                ) {
                    await raidHandler(interaction)
                }

                if (
                    interaction.customId === 'infiltrate-accept' ||
                    interaction.customId === 'infiltrate-next'
                ) {
                    await infiltrateHandler(interaction)
                }

                if (
                    interaction.customId === 'blackjack-stand' ||
                    interaction.customId === 'blackjack-hit'
                ) {
                    await blackjackHandler(interaction)
                }
            }

            if (interaction.isSelectMenu()) {
                if (interaction.customId === 'trial') {
                    await trialHandler(interaction)
                }
            }
        } else {
            await interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .setDescription(
                            `This bot only replies to commands in <#${config.channel.input.commandsID}>.`
                        ),
                ],
                ephemeral: true,
            })
        }
    } catch (error) {
        console.log(error)
    }
})
