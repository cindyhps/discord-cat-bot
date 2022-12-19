import axios from "axios"
import dotenv from "dotenv"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const TENOR_CLIENT_KEY = process.env.TENOR_CLIENT_KEY
const GIPHY_API_KEY = process.env.GIPHY_API_KEY

// TENOR
const fetchTenor = async (SEARCH, RANDOM) => {
	let gifUrls = []
	const LIMIT = SEARCH !== null ? "20" : "50" // default: 20 & max: 50

	const URL =
		"https://tenor.googleapis.com/v2/search?q=" +
		SEARCH +
		"&key=" +
		TENOR_API_KEY +
		"&client_key=" +
		TENOR_CLIENT_KEY +
		"&limit=" +
		LIMIT +
		"&random=" +
		RANDOM

	await axios
		.get(URL)
		.then((response) => {
			gifUrls = response.data.results.map((gif) => gif.url)
		})
		.catch((e) => console.log("err while fetchin from tenor: ", e))

	return gifUrls
}

// GIPHY
const fetchGiphy = async (SEARCH) => {
	let gifUrls = []
	const LIMIT = "25" // default: 25 & max: ?

	const URL =
		"https://api.giphy.com/v1/gifs/search?api_key=" +
		GIPHY_API_KEY +
		"&q=" +
		SEARCH +
		"&limit=" +
		LIMIT +
		"&offset=0&rating=g&lang=en"

	await axios
		.get(URL, {headers: { "Accept-Encoding": "gzip,deflate,compress" } })
		.then((response) => {
      gifUrls = response.data.data.map((gif) => gif.images.original.url)
    })
		.catch((e) => console.log("err while fetchin from giphy: ", e))

	return gifUrls
}

export const getGIF = async (q) => {
	const SEARCH = q ? "cat" + " " + q.value : "cat"
	const RANDOM = q ? true : false

	const giphyUrls = await fetchGiphy(SEARCH)
	const tenorUrls = await fetchTenor(SEARCH, RANDOM)
	const urlList = tenorUrls.concat(giphyUrls)

	return urlList[Math.floor(Math.random() * urlList.length)]
}