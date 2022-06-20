const client = require('..')
const { MessageEmbed } = require('discord.js')
const { hyperlink } = require('@discordjs/builders')
const config = require('../config.json')
const Web3 = require('web3')
const path = require('path')

module.exports = {
    sendTransfer: async function (res, tx, metadata) {
        try {
            const values = await res.returnValues

            const providedChannel = client.channels.cache.get(
                config.channel.records.salesID
            )

            const fields = [
                {
                    name: 'Transfer Event',
                    value: `${config.sales.name} #${
                        values.tokenId
                    } was purchased for ${Web3.utils.fromWei(
                        tx.value,
                        'ether'
                    )} ETH.`,
                },
                {
                    name: 'Token Marketplace Pages',
                    value: `${hyperlink(
                        'Looksrare',
                        config.sales.LooksrareURL +
                            config.sales.address +
                            '/' +
                            values.tokenId
                    )}, ${hyperlink(
                        'X2Y2',
                        config.sales.X2Y2URL +
                            config.sales.address +
                            '/' +
                            values.tokenId
                    )}, ${hyperlink(
                        'Rarible',
                        config.sales.RaribleURL +
                            config.sales.address +
                            ':' +
                            values.tokenId
                    )}, ${hyperlink(
                        'OpenSea',
                        config.sales.OpenSeaURL +
                            config.sales.address +
                            '/' +
                            values.tokenId
                    )}`,
                },
                {
                    name: 'Transaction',
                    value: hyperlink(
                        'Etherscan',
                        `https://etherscan.io/tx/${res.transactionHash}`
                    ),
                },
            ]

            const image = await metadata.data.image

            await providedChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .addFields(fields)
                        .setImage(image ? image : ''),
                ],
            })
        } catch (error) {
            console.log(error)
        }
    },
    sendFusion: async function (res, tx, metadata) {
        try {
            const values = await res.returnValues

            const providedChannel = client.channels.cache.get(
                config.channel.records.salesID
            )

            const fields = [
                {
                    name: 'Fusion Event',
                    value: `${config.sales.name} #${values.tokenId} evolved to ${values.fusionCount} fusions.`,
                },
                {
                    name: 'Token Marketplace Pages',
                    value: `${hyperlink(
                        'Looksrare',
                        config.sales.LooksrareURL +
                            config.sales.address +
                            '/' +
                            values.tokenId
                    )}, ${hyperlink(
                        'X2Y2',
                        config.sales.X2Y2URL +
                            config.sales.address +
                            '/' +
                            values.tokenId
                    )}, ${hyperlink(
                        'Rarible',
                        config.sales.RaribleURL +
                            config.sales.address +
                            ':' +
                            values.tokenId
                    )}, ${hyperlink(
                        'OpenSea',
                        config.sales.OpenSeaURL +
                            config.sales.address +
                            '/' +
                            values.tokenId
                    )}`,
                },
                {
                    name: 'Transaction',
                    value: hyperlink(
                        'Etherscan',
                        `https://etherscan.io/tx/${res.transactionHash}`
                    ),
                },
            ]

            const image = await metadata.data.image

            await providedChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(config.embed_color)
                        .addFields(fields)
                        .setImage(image ? image : ''),
                ],
            })
        } catch (error) {
            console.log(error)
        }
    },
}
