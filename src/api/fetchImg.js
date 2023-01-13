import Airtable from "airtable"
import dotenv from "dotenv"
import random from "random"

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
  "catedit",
]

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE_KEY,
  requestTimeout: 10000,
})

var base = Airtable.base(AIRTABLE_BASE_ID)

// https://support.airtable.com/docs/formula-field-reference

export const getCatImg = async (value) => {
  let records = []

  const l1_date = new Date();
  console.log(`[${l1_date.toLocaleString()}]+ VALUE:`, value)

  const callType = categorys.includes(value) ? "category" : value ? "tag" : undefined

  if (callType === "category") {
    // BY CATEGORY
    records = await base("cat-pictures")
      .select({
        fields: ["url"],
        filterByFormula: `SEARCH(${'"' + value + '"'}, category)`,
      })
      .all()
      .catch((e) => console.log("E1:", e))
  } else if (callType === "tag") {
    // BY TAGS
    records = await base("cat-pictures")
      .select({
        fields: ["url"],
        filterByFormula: `SEARCH(${'"' + value.value + '"'}, tags)`,
      })
      .all()
      .catch((e) => console.log("E2:", e))
  } else {
    // ALL
    records = await base("cat-pictures")
      .select({
        fields: ["url"],
      })
      .all()
      .catch((e) => console.log("E3:", e))
  }

  const l2_date = new Date();
  console.log(`[${l2_date.toLocaleString()}]+ RECORDS:`, records.length)

  if (records.length > 0) {
    return records.map((record) => record.fields.url)[random.int(0, records.length - 1)]
  } else {
    return "Sorry, I couldn't find any images for that tag."
  }
}
