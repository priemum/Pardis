const mongoose = require('mongoose')

const guildSchema = mongoose.Schema(
	{
		id: {
			type: String,
		},
		invitees: [
			{
				type: String,
			},
		],
	},
	{
		timestamps: true,
	}
)

const Guild = mongoose.model('Guild', guildSchema)

module.exports = Guild
