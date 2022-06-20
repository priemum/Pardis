module.exports = async function randomNumberInRange(min, max) {
	try {
		return Math.floor(Math.random() * (max - min) + min)
	} catch (error) {
		console.log(error)
	}
}
