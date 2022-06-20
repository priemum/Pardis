// Models
const UserModel = require('../../database/models/userModel')
const FactionModel = require('../../database/models/factionModel')

module.exports = async function getUserFactionPair(interaction) {
    const fetchedUser = await UserModel.findOne({
        discordID: interaction.user.id,
    })

    const fetchedFaction = await FactionModel.findOne({
        name: fetchedUser.faction,
    })

    return { fetchedUser, fetchedFaction }
}
