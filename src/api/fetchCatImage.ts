import { CacheType, CommandInteractionOption } from "discord.js"
import random from "random"

import { CatsDB } from "./../data/cats"
import { categories } from "../constants.js"

export default function FetchCatImage(value: CommandInteractionOption<CacheType> | null): string {
	let searchValue = ""

	if (value) {
		if (typeof value === "string") {
			searchValue = value
		} else if (value.value) {
			searchValue = value.value?.toString()
		}
	}

	function getRandomImage(list: CatImage[]) {
		return list[random.int(0, list.length - 1)].url
	}

	//////// CATEGORY ////////
	if (searchValue && categories.includes(searchValue)) {
		return getRandomImage(CatsDB.filter((cat) => cat.category === searchValue))
	}

	//////// TAG ////////
	if (searchValue) {
		return getRandomImage(CatsDB.filter((cat) => cat.tags.includes(searchValue)))
	}

	//////// RANDOM ////////
	if (!searchValue) {
		return getRandomImage(CatsDB)
	}

	return "Sorry, I couldn't find any images for that tag."
}
