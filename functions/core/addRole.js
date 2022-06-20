const client = require('../..')
const config = require('../../config.json')

module.exports = async function addRole(discordID, providedRole) {
	try {
		const guild = client.guilds.cache.get(config.guildID)

		await guild.members.cache
			.get(discordID)
			.roles.add(
				guild.roles.cache.find(
					(role) => role.name === providedRole
				)
			)
	} catch (error) {
		console.log(error)
	}
}
