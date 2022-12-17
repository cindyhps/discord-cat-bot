import Airtable from "airtable"
import dotenv from "dotenv"

// Load secrets (Only for local env)
dotenv.config()

const AIRTABLE_KEY = process.env.AIRTABLE_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE_KEY,
})

var base = Airtable.base(AIRTABLE_BASE_ID)

export const getCatImg = async (category) => {
  let records = await base("cat-pictures").select().all()
  let URLs = []

  if (category) {
    URLs = records
      .map((record) => record.fields)
      .filter((item) => item.category === category)
      .map((item) => item.url)
  } else {
    URLs = records.map((record) => record.fields).map((item) => item.url)
  }

  return URLs[Math.floor(Math.random() * URLs.length)]
}
