import { CacheType, ChatInputCommandInteraction } from "discord.js"
import arrayShuffle from "array-shuffle"
import randomNumber from "random"
import dotenv from "dotenv"
import axios from "axios"

import { notFoundGIF } from "../constants"

dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const TENOR_CLIENT_KEY = process.env.TENOR_CLIENT_KEY
const GIPHY_API_KEY = process.env.GIPHY_API_KEY

const fetchTenor = async (query: string) => {
	const limit = query ? "15" : "30"
	let urlList: string[] = []
	const URL =
		"https://tenor.googleapis.com/v2/search?q=" +
		query +
		"&key=" +
		TENOR_API_KEY +
		"&client_key=" +
		TENOR_CLIENT_KEY +
		"&limit=" +
		limit +
		"&media_filter=gif"

	await axios
		.get(URL)
		.then((response) => (urlList = response.data.results.map((gif: any) => gif.url)))
		.catch((e) => console.error("ERR-TENOR", e))

	return urlList
}

const fetchGiphy = async (query: string) => {
	const limit = "20"
	let urlList: string[] = []
	let URL =
		"https://api.giphy.com/v1/gifs/search?" +
		"api_key=" +
		GIPHY_API_KEY +
		"&q=" +
		query +
		"&limit=" +
		limit +
		"&offset=0&rating=g&lang=en"

	await axios
		.get(URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
		.then((response) => (urlList = response.data.data.map((gif: any) => gif.images.original.url)))
		.catch((e) => console.error("ERR-GIPHY: ", e))

	return urlList
}

export default async function fetchGIF(
	interaction: ChatInputCommandInteraction<CacheType>,
	search: string | undefined | null
): Promise<void> {
	const dq = "cat"
	let query = search ? `${dq} ${search}` : dq
	let result = notFoundGIF

	const giphyUrls = await fetchGiphy(query)
	const tenorUrls = await fetchTenor(query)
	const shuffleGifs = arrayShuffle(tenorUrls.concat(giphyUrls))

	if (shuffleGifs.length > 0) {
		result = shuffleGifs[randomNumber.int(0, shuffleGifs.length - 1)]
	}

	console.debug(`[fetchGIF:${query}]: ${result}`)
	await interaction.editReply(result)
}
