const client = require('../index.js')

// Models
const UserModel = require('../database/models/userModel')

client.on('guildMemberAdd', async function (member) {
    try {
        // Reserved for later
    } catch (error) {
        console.log(error)
    }
})

client.on('guildMemberRemove', async function (member) {
    try {
        const fetchedUser = await UserModel.findOne({
            discordID: member.user.id,
        })

        if (fetchedUser.xp > 5000) {
            fetchedUser.xp = 5000
            await fetchedUser.save()
        }
    } catch (error) {
        console.log(error)
    }
})
