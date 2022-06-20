const mongoose = require('mongoose')

const factionSchema = mongoose.Schema(
	{
		name: {
			type: String,
		},
		members: {
			type: Number,
			default: 0,
		},
		spots: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

const Faction = mongoose.model('Faction', factionSchema)

module.exports = Faction
