import { CacheType, CommandInteractionOption } from "discord.js"
import random from "random"

import CatsDB from "./../data/cats"
import { categories } from "../constants"

const notFound = "Sorry, I couldn't find any images for that tag."

export default function fetchCatImage(value: string | CommandInteractionOption<CacheType> | null): string {
	let searchValue = ""

	if (value) {
		if (typeof value === "string") {
			searchValue = value
		} else if (value.value) {
			searchValue = value.value?.toString()
		}
	}

	function getRandomImage(list: CatImage[]) {
		console.log(list)
		const listLen = list.length
		const randomInt = random.int(0, listLen - 1)
		const image = list[listLen === 1 ? 0 : randomInt]?.url
		return image || notFound
	}

	//////// CATEGORY ////////
	if (searchValue && categories.includes(searchValue)) {
		return getRandomImage(CatsDB.filter((cat) => cat.category === searchValue))
	}

	//////// TAG ////////
	if (searchValue) {
		console.log(searchValue)
		return getRandomImage(CatsDB.filter((cat) => cat.tags.includes(searchValue)))
	}

	//////// RANDOM ////////
	if (!searchValue) {
		return getRandomImage(CatsDB)
	}

	return notFound
}
