import Airtable from "airtable"
import dotenv from "dotenv"
import random from "random"
// Load secrets (Only for local env)
dotenv.config()

const AIRTABLE_KEY = process.env.AIRTABLE_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE_KEY,
})

var base = Airtable.base(AIRTABLE_BASE_ID)

// const filterByCategory = {
//   fields: ["url"],
//   filterByFormula:`SEARCH(${'"' + category + '"'}, category)`,
// }

// // TODO filter by user entered tags
// // https://support.airtable.com/docs/formula-field-reference
// const filterByTags = {
//   fields: ["url"],
//   filterByFormula:`SEARCH(${'"' + category + '"'}, category)`,
// }

export const getCatImg = async (category) => {
  // if category is not specifed returns all records. //TODO limit unspecifed calls.
  let records = await base("cat-pictures")
    .select({
      fields: ["url"],
      filterByFormula: category
        ? `SEARCH(${'"' + category + '"'}, category)`
        : ""
    })
    .all();

  console.log(records.length);

  return records.map((record) => record.fields.url)[
    random.int(0, records.length)
  ];
};
