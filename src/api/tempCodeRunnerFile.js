import Airtable from "airtable"
import dotenv from "dotenv"

dotenv.config()

const AIRTABLE_KEY = process.env.AIRTABLE_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: AIRTABLE_KEY,
})

var base = Airtable.base(AIRTABLE_BASE_ID)

export const getCatImg = async (category) => {
	let records = await base("cat-pictures")
		.select({
			maxRecords: 10,
			view: "Grid view",
		})
		.all()

		console.log(records)
}

// [Math.floor(Math.random() * resultList.length)]

// const resultList = records
// .map((record) => record.fields)
// .filter((item) => item.category === category)
// .map((item) => item.url)
