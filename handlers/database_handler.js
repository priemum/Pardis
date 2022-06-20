const mongoose = require('mongoose')
require('dotenv').config()
const fs = require('fs')

const mongoEventFiles = fs
	.readdirSync('./database/events')
	.filter((file) => file.endsWith('.js'))

module.exports = (client) => {
	try {
		client.databaseLogin = async () => {
			for (let file of mongoEventFiles) {
				let event = require(`../database/events/${file}`)
				if (event.once) {
					mongoose.connection.once(event.name, (...args) =>
						event.execute(...args)
					)
				} else {
					mongoose.connection.on(event.name, (...args) =>
						event.execute(...args)
					)
				}
				// console.log(`[${file}] event loaded successfully by [DatabaseHandler].`)
			}

			mongoose.Promise = global.Promise
			mongoose.connect(process.env.ATLAS_URL, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			})
		}
	} catch (error) {
		console.log(error)
	}
}
