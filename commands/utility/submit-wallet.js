const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder, bold } = require('@discordjs/builders')
const { ethers } = require('ethers')
const config = require('../../config.json')

const UserModel = require('../../database/models/userModel')
const addRole = require('../../functions/core/addRole')
const removeRole = require('../../functions/core/removeRole')

module.exports = {
	...new SlashCommandBuilder()
		.setName('submit-wallet')
		.setDescription('This is irreversible, Only usable by eligible members ~ 48h before the mint.')
		.setDefaultPermission(false)
		.addStringOption((option) =>
			option
				.setName('wallet')
				.setDescription('Your Ethereum address')
				.setRequired(true)
		),

	run: async (client, interaction, args) => {
		try {
			let description
			let ephemeral = false

			const wallet = interaction.options.getString('wallet')

			if (ethers.utils.isAddress(wallet)) {
				const matchingWalletUser = await UserModel.findOne({
					wallet,
				})

				if (matchingWalletUser) {
					description = `This Ethereum wallet has already been registered.`
					ephemeral = true
				} else {
					const fetchedUser = await UserModel.findOne({
						discordID: interaction.user.id,
					})

					fetchedUser.wallet = wallet

					await fetchedUser.save()
					await addRole(interaction.user.id, 'Whitelisted')
					await removeRole(interaction.user.id, 'Wallet-Submission-Eligible')

					description = `Congratulations! 🎉 Your Ethereum wallet has successfully been received. You know have the <@&${config.role.whitelistID}> role confirming you can take part in the presale.`
					ephemeral = false
				}
			} else {
				description = `Your input was not a valid Ethereum address.`
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
