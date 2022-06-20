const UserModel = require('../../database/models/userModel')
const FactionModel = require('../../database/models/factionModel')

const users = [
	{
		name: 'Reapers',
	},
	{
		name: 'Tricksters',
	},
]

module.exports = {
	destroyData: async function () {
		try {
			await FactionModel.deleteMany()
			console.log('Data destroyed!')
		} catch (error) {
			console.error(error)
		}
	},
	insertData: async function () {
		try {
			await FactionModel.insertMany(users)
			console.log('Data inserted!')
		} catch (error) {
			console.error(error)
		}
	},
}
