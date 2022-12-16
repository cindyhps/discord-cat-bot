const axios = require("axios").default
const dotenv = require("dotenv")
var Airtable = require("airtable")

dotenv.config()

const AIRTABLE_KEY = process.env.AIRTABLE_KEY
AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

var Airtable = require("airtable")
Airtable.configure({
	endpointUrl: "https://api.airtable.com",
	apiKey: AIRTABLE_KEY,
})

var base = Airtable.base(AIRTABLE_BASE_ID)

const getCatImg = async (category) => {
	base("cat-pictures")
		.select({
			// Selecting the first 3 records in Grid view:
			maxRecords: 11,
			view: "Grid view",
		})
		.eachPage(
			function page(records, fetchNextPage) {
				// This function (`page`) will get called for each page of records.

				const resultList = records
					.map((record) => record.fields)
					.filter((item) => item.category === category)
					.map((item) => item.url)

				return resultList[Math.floor(Math.random() * resultList.length)]
				// To fetch the next page of records, call `fetchNextPage`.
				// If there are more records, `page` will get called again.
				// If there are no more records, `done` will get called.
				fetchNextPage()
			},
			function done(err) {
				if (err) {
					console.error(err)
					return
				}
			}
		)
}
