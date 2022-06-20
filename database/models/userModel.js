const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
	{
		discordID: {
			type: String,
			unique: true,
		},
		faction: {
			type: String,
		},
		invites: {
			type: Number,
			default: 0,
		},
		invitees: [
			{
				type: String,
			},
		],
		xp: {
			type: Number,
			default: 5000,
		},
		wallet: {
			type: String,
		},
		whitelisted: {
			type: Boolean,
			default: false,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

const User = mongoose.model('User', userSchema)

module.exports = User
