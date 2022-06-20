const client = require('../..')
const schedule = require('node-schedule')

module.exports = async function scheduledMesage(channel, timing, content) {
	try {
		const providedChannel = client.channels.cache.get(channel)

		await providedChannel.bulkDelete(99, true)

		// Ping
		schedule.scheduleJob(timing, async () => {
			await providedChannel.send({
				content,
			})
		})
	} catch (error) {
		console.log(error)
	}
}