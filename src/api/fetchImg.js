import Airtable from "airtable"
import dotenv from "dotenv"
import random from "random"
import fs from "fs"
import info from "../info.json" assert { type: "json" }

// Load secrets (Only for local env)
dotenv.config()

const AIRTABLE_KEY = process.env.AIRTABLE_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

const categorys = [
  "catcasual",
  "catfeels",
  "catmental",
  "catreact",
  "catlove",
  "catmemelove",
  "catmeme",
  "catedit"
]

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE_KEY,
})

var base = Airtable.base(AIRTABLE_BASE_ID)

// https://support.airtable.com/docs/formula-field-reference

export const getCatImg = async (value) => {
  let records = []

  const callType = categorys.includes(value)
    ? "category"
    : value
      ? "tag"
      : undefined

  if (callType === "category") {
    // BY CATEGORY
    records = await base("cat-pictures")
      .select({
        fields: ["url"],
        filterByFormula: `SEARCH(${'"' + value + '"'}, category)`,
      })
      .all()
  } else if (callType === "tag") {
    // BY TAGS
    records = await base("cat-pictures")
      .select({
        fields: ["url"],
        filterByFormula: `SEARCH(${'"' + value.value + '"'}, tags)`,
      })
      .all()
  } else {
    // ALL
    records = await base("cat-pictures")
      .select({
        fields: ["url"],
      })
      .all()
    saveTotalImg(records.length)
  }

  if (records.length > 0) {
    return records.map((record) => record.fields.url)[random.int(0, records.length - 1)]
  } else {
    return "Sorry, I couldn't find any images for that tag."
  }
}

const saveTotalImg = (value) => {
  if (value !== info.totalImg) {
    fs.writeFile('./src/info.json', JSON.stringify({ totalImg: value }), (err) => {
      if (err) throw err;
      console.log('+ Total images saved : ', value);
    });
  }
}