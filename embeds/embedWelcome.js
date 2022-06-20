const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { bold, inlineCode } = require('@discordjs/builders')
const config = require('../config.json')

module.exports = {
    firstEmbed: async function () {
        return new MessageEmbed()
            .setColor(config.embed_color)
            .setDescription(
                `${bold('What is this server about??')}\n\n${bold(
                    'FREE-TO-MINT'
                )} Experimental NFT Collection trying to do things a little differently. What if your NFT ${bold(
                    'EVOLVED'
                )} in each of your transactions? What if a collection's supply ${bold(
                    'DECREMENTED'
                )} after every transaction?\n\nYou can proceed using this 👇 button.`
            )
    },
    firstComponent: async function () {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('welcome-first')
                .setLabel('Proceed...')
                .setStyle('SECONDARY')
        )
    },
    secondEmbed: async function () {
        return new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(
                `Each single sale in this collection can trigger a ${bold(
                    'FUSION'
                )}, evolving the buyer's NFT, and burning the sold NFT.\n\nThis decreases the entire supply of the collection and raises the rarity of all NFTs still in circulation. This is deflationary-supply taken to the EXTREME!`
            )
    },
    secondComponent: async function () {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('welcome-second')
                .setLabel(`Proceed...`)
                .setStyle('SECONDARY')
        )
    },
    thirdEmbed: async function () {
        return new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`The mint will be ${bold('FREE')}!`)
    },
    thirdComponent: async function () {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('welcome-third')
                .setLabel(`Proceed...`)
                .setStyle('SECONDARY')
        )
    },
    fourthEmbed: async function () {
        return new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(
                `You can become <@&${config.role.whitelistID}> by ${bold(
                    'CONTRIBUTING'
                )}.\n\n• Contribute to the lore.\n• Share ideas on how our unique fusion system can be utilized.\n• Spread the word on social media.\n• Share your art that shows how our fusion system will look like.\n• Invite friends to join your faction.\n• Help NFT beginners in the server.`
            )
    },
    fourthComponent: async function () {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('welcome-fourth')
                .setLabel('Proceed...')
                .setStyle('SECONDARY')
        )
    },
    fifthEmbed: async function () {
        let rulesArray = [
            'Do not spam or promote excessively.',
            'Do not post NSFW content.',
            'Be nice, and respect all members.',
            'Do not use profanity, racial slurs, or offensive comments of any kind.',
            'Do not post personal information.',
            'Keep conversations in English.',
        ]
        let constructedFields = []

        for (let index in rulesArray) {
            constructedFields.push({
                name: `Rule #${parseInt(index) + 1}`,
                value: rulesArray[index],
            })
        }

        return new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${bold('What are the rules?')}`)
            .addFields(constructedFields)
    },
    fifthComponent: async function () {
        return new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('welcome-fifth')
                .setLabel('Accept...')
                .setStyle('SUCCESS')
        )
    },
    finalEmbed: async function (randomRole) {
        let role

        switch (randomRole) {
            case 'Reapers':
                role = config.role.reapersID
                break
            case 'Tricksters':
                role = config.role.trickstersID
                break
        }

        return new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Congratulations! You now have access to our server!🎉`)
            .setDescription(
                `You have joined <@&${role}>! Drop a GM in <#${config.channel.generalID}>!`
            )
    },
}
