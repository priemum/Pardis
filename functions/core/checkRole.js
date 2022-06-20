module.exports = async function checkRole(interaction, roleName) {
	try {
		const member = interaction.guild.members.cache.get(interaction.user.id)
		if (member.roles.cache.some((role) => role.name === roleName)) {
			return true
		} else return false
	} catch (error) {
		console.log(error)
	}
}
