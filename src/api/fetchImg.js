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
	let records = await base("cat-pictures").select().all()

	const urls = records
		.map((record) => record.fields)
		.filter((item) => item.category === category)
		.map((item) => item.url)

	return urls[Math.floor(Math.random() * urls.length)]
}
