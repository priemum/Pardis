const client = require('../..')
const axios = require('axios')
const config = require('../../config.json')
const Web3 = require('web3')
const path = require('path')
const { sendTransfer, sendFusion } = require('../../embeds/embedSales')
require('dotenv').config()

module.exports = async function contractListener() {
    try {
        const web3 = new Web3(
            new Web3.providers.WebsocketProvider(
                process.env.ALCHEMY_SOCKET_ADDRESS,
                {
                    clientConfig: {
                        keepalive: true,
                        keepaliveInterval: 60000,
                    },
                    reconnect: {
                        auto: true,
                        delay: 5000, // ms
                        maxAttempts: 25,
                        onTimeout: false,
                    },
                }
            )
        )

        const contract = new web3.eth.Contract(
            require(path.resolve('data/ABI.json')),
            config.sales.address
        )
        
        contract.events.Transfer(async (err, res) => {
            if (!err) {
                const tx = await web3.eth.getTransaction(res.transactionHash);

                const metadata = await axios.get(`${config.sales.baseURI}${await res.returnValues.tokenId}`)

                await sendTransfer(res, tx, metadata)
            }
        })

        contract.events.Fusion(async (err, res) => {
            if (!err) {
                const tx = await web3.eth.getTransaction(res.transactionHash);

                const metadata = await axios.get(`${config.sales.baseURI}${await res.returnValues.tokenId}`)

                await sendFusion(res, tx, metadata)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
