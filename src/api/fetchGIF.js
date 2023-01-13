import axios from "axios"
import dotenv from "dotenv"
import arrayShuffle from "array-shuffle"
import randomNumber from "random"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const TENOR_CLIENT_KEY = process.env.TENOR_CLIENT_KEY
const GIPHY_API_KEY = process.env.GIPHY_API_KEY

// TENOR
const fetchTenor = async (q) => {
  const search = q ? "cat" + " " + q.value : "cat"
  const limit = q ? "15" : "30"

  let gifUrls = []
  const URL =
    "https://tenor.googleapis.com/v2/search?q=" +
    search +
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
      gifUrls = response.data.results.map((gif) => gif.url)
    })
    .catch((e) => console.log("err while fetchin from tenor: ", e))

  return gifUrls
}

// GIPHY
const fetchGiphy = async (q) => {
  const search = "cat"
  const limit = "20"

  let gifUrls = []
  let URL =
    "https://api.giphy.com/v1/gifs/search?" +
    "api_key=" +
    GIPHY_API_KEY +
    "&q=" +
    search +
    "&limit=" +
    limit +
    "&offset=0&rating=g&lang=en"

  await axios
    .get(URL, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
    .then((response) => {
      gifUrls = response.data.data.map((gif) => gif.images.original.url)
    })
    .catch((e) => console.log("err while fetchin from giphy: ", e))

  return gifUrls
}

export const getGIF = async (q) => {
  console.log("q:", q)
  const giphyUrls = q ? [] : await fetchGiphy(q)
  const tenorUrls = await fetchTenor(q)

  const urlList = arrayShuffle(tenorUrls.concat(giphyUrls))

  if (urlList.length > 0) {
    return urlList[randomNumber.int(0, urlList.length) - 1]
  } else {
    return "Sorry, I couldn't find any gifs for that search."
  }
}
