const client = require('../index.js')
const config = require('../config.json')
const addRole = require('../functions/core/addRole')
const removeRole = require('../functions/core/removeRole')

client.on('messageReactionAdd', async (reaction, user) => {
    try {
        if (reaction.partial) {
            try {
                await reaction.fetch()
            } catch (error) {
                console.log(error)
                return
            }
        }

        if (reaction.message.channel.id == config.channel.sensitive.eventRolesID) {
            if (reaction.emoji.name === '🎲') {
                await addRole(user.id, 'Gamers')
            } else if (reaction.emoji.name === '🐤') {
                await addRole(user.id, 'Twitter')
            }
        }
    } catch (error) {
        console.log(error)
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    try {
        if (reaction.partial) {
            try {
                await reaction.fetch()
            } catch (error) {
                console.log(error)
                return
            }
        }

        if (reaction.message.channel.id == config.channel.sensitive.eventRolesID) {
            if (reaction.emoji.name === '🎲') {
                await removeRole(user.id, 'Gamers')
            } else if (reaction.emoji.name === '🐤') {
                await removeRole(user.id, 'Twitter')
            }
        }
    } catch (error) {
        console.log(error)
    }
})
