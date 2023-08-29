import { CacheType, CommandInteractionOption } from "discord.js"
import arrayShuffle from "array-shuffle"
import randomNumber from "random"
import dotenv from 'dotenv';
import axios from "axios"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const TENOR_CLIENT_KEY = process.env.TENOR_CLIENT_KEY
const GIPHY_API_KEY = process.env.GIPHY_API_KEY

// TENOR
const fetchTenor = async (query: string) => {
  const limit = query ? "15" : "30"

  let gifUrls: string[] = []
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
    .then((response) => {
      gifUrls = response.data.results.map((gif: any) => gif.url)
    })
    .catch((e) => console.log("err while fetchin from tenor: ", e))

  return gifUrls
}

// GIPHY
const fetchGiphy = async (query: string) => {
  const limit = "20"

  let gifUrls: string[] = []
  let URL =
    "https://api.giphy.com/v1/gifs/search?" +
    "api_key=" +
    GIPHY_API_KEY +
    "&q=" +
    query +
    "&limit=" +
    limit +
    "&offset=0&rating=g&lang=en"
  console.log(URL)
  await axios
    .get(URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
    .then((response) => {
      gifUrls = response.data.data.map((gif: any) => gif.images.original.url)
    })
    .catch((e) => console.log("err while fetchin from giphy: ", e))

  return gifUrls
}

export const getGIF = async (q: CommandInteractionOption<CacheType> | null) => {
  let query = "cat"

  if (q) {
    if (typeof q.value === "string") {
      query = query + " " + q.value
    } else {
      query = query + " " + q.value?.toString()
    }
  }

  const giphyUrls = await fetchGiphy(query)
  const tenorUrls =  await fetchTenor(query)

  const urlList = arrayShuffle(tenorUrls.concat(giphyUrls))

  if (urlList.length > 0) {
    return urlList[randomNumber.int(0, urlList.length) - 1]
  } else {
    return "Sorry, I couldn't find any gifs for that search."
  }
}
