const client = require('../index.js')
const config = require('../config.json')
const { bold } = require('@discordjs/builders')

// Functions
const { tempInvitees, codeUses } = require('../functions/core/createTempData')
const setCodeUses = require('../functions/core/setCodeUses')

// Models
const GuildModel = require('../database/models/guildModel')
const FactionModel = require('../database/models/factionModel')
const UserModel = require('../database/models/userModel')

client.on('inviteCreate', async (invite) => {
    try {
        await setCodeUses()
    } catch (error) {
        console.log(error)
    }
})

client.on('inviteDelete', async (invite) => {
    try {
        await setCodeUses()
    } catch (error) {
        console.log(error)
    }
})
