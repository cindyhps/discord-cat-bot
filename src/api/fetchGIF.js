import axios from "axios"
import dotenv from "dotenv"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const CLIENT_KEY = process.env.CLIENT_KEY
const GIPHY_API_KEY = process.env.GIPHY_API_KEY

const fetchTenor = async (SEARCH) => {
  const gifUrls = []
  const RANDOM = true
  const TENOR_LIMIT = searchValue !== null ? "20" : "50" // default: 20 & max: 50

  const tenorURL =
    "https://tenor.googleapis.com/v2/search?q=" +
    SEARCH +
    "&key=" +
    TENOR_API_KEY +
    "&client_key=" +
    CLIENT_KEY +
    "&limit=" +
    TENOR_LIMIT +
    "&random=" +
    RANDOM


  // GET TENOR GIFS
  await axios.get(tenorURL).then((response) => {
    gifUrls = response.data.results.map((gif) => gif.url)
  }).catch((e) => console.log("err on fetchin from tenor: ", e))

  return gifUrls
}

const fetchGiphy = async (SEARCH) => {
  let gifUrls = []
  const GIPHY_LIMIT = "25" // default: 25 & max: ?

  const giphyURL =
    "https://api.giphy.com/v1/gifs/search?api_key=" +
    GIPHY_API_KEY +
    "&q=" +
    SEARCH +
    "&limit=" +
    GIPHY_LIMIT +
    "&offset=0&rating=g&lang=en"

  // GET GIPHY GIFS
  await axios.get(giphyURL).then((response) => {
    gifUrls = response.data["data"].map((gif) => gif.images.original.url)
    console.log(gifData)
  }).catch((e) => console.log("err on fetchin from giphy: ", e))

  return gifUrls
}

export const getGIF = async (searchValue) => {
  let responseUrl = ""

  const SEARCH = searchValue !== null ? "cat kitty" + " " + searchValue.value : "cat"

  const giphyUrls = await fetchGiphy(SEARCH)
  const tenorUrls = await fetchTenor(SEARCH)
  const urlList = tenorUrls.concat(giphyUrls)

  console.log(urlList)

  responseUrl = urlList[Math.floor(Math.random() * urlList.length)]

  return responseUrl
}

