import axios from "axios"
import dotenv from "dotenv"

// Load secrets (Only for local env)
dotenv.config()

const TENOR_API_KEY = process.env.TENOR_API_KEY
const GIPHY_API_KEY = process.env.GIPHY_API_KEY
const CLIENT_KEY = process.env.CLIENT_KEY

const TENOR_LIMIT = "1"
const GIPHY_LIMIT = "1"

const SEARCH = "cat"

console.log(TENOR_API_KEY)

////////////////////// GIPHY //////////////////////

var giphyURL =
  "https://api.giphy.com/v1/gifs/search?api_key=" +
  GIPHY_API_KEY +
  "&q=" +
  SEARCH +
  "&limit=" +
  GIPHY_LIMIT +
  "&offset=0&rating=g&lang=en"

axios.get(giphyURL).then((response) => {
  console.log(response.data["data"][0]["images"]["original"]["url"])
})

////////////////////// TENOR //////////////////////

var tenorURL =
  "https://tenor.googleapis.com/v2/search?q=" +
  SEARCH +
  "&key=" +
  TENOR_API_KEY +
  "&client_key=" +
  CLIENT_KEY +
  "&limit=" +
  TENOR_LIMIT

axios.get(tenorURL).then((response) => {
  console.log(response.data.results[0].url)
})