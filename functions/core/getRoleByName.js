const client = require('../..')
const config = require('../config.json')

module.exports = async function getRoleByName(name) {
	try {
		const guild = client.guilds.cache.get(config.guildID)

		return guild.roles.cache.filter((item) => item.name === name).first()
	} catch (error) {
		console.log(error)
	}
}
