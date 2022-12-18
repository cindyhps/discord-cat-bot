import axios from "axios"
import dotenv from "dotenv"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const CLIENT_KEY = process.env.CLIENT_KEY
const TENOR_LIMIT = "50" // 20 default & 50 max
const RANDOM = true // random results

export const getTenorGIF = async (searchValue) => {

  // check is user enter a search value
  const SEARCH = searchValue !== null ? "cat" + searchValue.value : "cat"
  let responseUrl = ""

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

    responseUrl = urlList[Math.floor(Math.random() * urlList.length)].url
  }).catch((e) => console.log("err on fetchin gif: ", e))

  return responseUrl
}



