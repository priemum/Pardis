const client = require('../index.js')
const config = require('../config.json')
const wait = require('timers/promises').setTimeout

// Helper functions
const getChannels = require('../functions/core/getChannels')
const scheduledMessage = require('../functions/core/scheduledMessage')
const setCodeUses = require('../functions/core/setCodeUses')
const contractListener = require('../functions/sales/contractListener')

client.on('ready', async () => {
    await wait(2000)

    console.log(`${client.user.username} is online`)
    client.user.setActivity('🌠🌠🌠', { type: 'WATCHING' })

    await setCodeUses()
    await getChannels()
    contractListener()

    scheduledMessage(config.channel.testID, '*/29 * * * *', 'Ping!')
})
