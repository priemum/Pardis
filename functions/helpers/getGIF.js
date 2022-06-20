const randomNumberInRange = require('./randomNumberInRange')
const config = require('../../config.json')

module.exports = {
    getWinGIF: async function () {
        if ((await randomNumberInRange(0, 2)) == 0) {
            return config.gifs.win[
                await randomNumberInRange(0, config.gifs.win.length)
            ]
        }

        return null
    },
    getLoseGIF: async function () {
        if ((await randomNumberInRange(0, 2)) == 0) {
            return config.gifs.lose[
                await randomNumberInRange(0, config.gifs.lose.length)
            ]
        }

        return null
    },
    getEvilGIF: async function () {
        if ((await randomNumberInRange(0, 2)) == 0) {
            return config.gifs.evil[
                await randomNumberInRange(0, config.gifs.evil.length)
            ]
        }

        return null
    },
}
