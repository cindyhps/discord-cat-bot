import { CacheType, CommandInteractionOption } from "discord.js"
import random from "random"

import { CatsDB } from "./../data/cats"
import { categories } from "../constants.js"

export default function FetchCatImage(value: CommandInteractionOption<CacheType> | null | string): string {
	if (!value) return "The tag you entered is invalid."
	let searchValue = ""

	if (typeof value === "string") {
		searchValue = value.toLowerCase().trim()
	} else {
		searchValue = typeof value.value === "string" ? value.value.toLowerCase().trim() : ""
	}

	//////// CATEGORY ////////
	if (categories.includes(searchValue)) {
		const cats = CatsDB.filter((cat) => cat.category === searchValue)
		return cats[random.int(0, cats.length - 1)].url
	}

	//////// TAG ////////
	if (searchValue) {
		const cats = CatsDB.filter((cat) => cat.tags.includes(searchValue))
		return cats[random.int(0, cats.length - 1)].url
	}

	//////// RANDOM ////////
	if (!searchValue) {
		return CatsDB[random.int(0, CatsDB.length - 1)].url
	}

	return "Sorry, I couldn't find any images for that tag."
}
