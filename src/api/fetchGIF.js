import axios from "axios"
import dotenv from "dotenv"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const CLIENT_KEY = process.env.CLIENT_KEY
const TENOR_LIMIT = "50" // 20 default & 50 max
const SEARCH = "cat"
const RANDOM = true

export const getTenorGIF = async () => {
  let url = ""
  var tenorURL =
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

  await axios.get(tenorURL).then((response) => {
    const urlList = response.data.results

    url = urlList[Math.floor(Math.random() * urlList.length)].url
  }).catch((e) => console.log("err on fetchin gif: ", e))

  return url
}



