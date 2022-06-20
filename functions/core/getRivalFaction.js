// Models
const FactionModel = require('../../database/models/factionModel')

// Functions

module.exports = async function getRivalFaction(interaction, fetchedUser) {
    try {
        const factions = ['Reapers', 'Tricksters']

        const filteredFactions = factions.filter(
            (e) => e !== fetchedUser.faction
        )

        const fetchedFaction = await FactionModel.findOne({
            name: filteredFactions[0],
        })

        return fetchedFaction
    } catch (error) {
        console.log(error)
    }
}
