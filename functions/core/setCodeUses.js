const client = require('../..')
const config = require('../../config.json')
const { codeUses } = require('./createTempData')

module.exports = async function removeRole() {
    try {
        await client.guilds.cache
            .get(config.guildID)
            .invites.fetch()
            .then((invites) => {
                invites.each((inv) => codeUses.set(inv.code, inv.uses))
            })
    } catch (error) {
        console.log(error)
    }
}
