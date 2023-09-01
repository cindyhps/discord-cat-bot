import { CacheType, ChatInputCommandInteraction } from "discord.js"
import random from "random"

import CatsDB from "../../data/cats"
import { categories, notFoundIMAGE } from "../constants"

export default async function fetchImage(
	interaction: ChatInputCommandInteraction<CacheType>,
	value: string | undefined | null
): Promise<void> {
	const type = typeof value === "string" ? (categories.includes(value) ? "category" : "tag") : "random"

	const replayRandomImage = async (list: CatImage[]) => {
		const image = list[list.length === 1 ? 0 : random.int(0, list.length - 1)]?.url
		console.debug(`[fetchImage:${type}]: ${image}`)
		await interaction.editReply({ content: image ? image : notFoundIMAGE })
	}

	switch (type) {
		case "random":
			replayRandomImage(CatsDB)
			break
		case "category":
			replayRandomImage(CatsDB.filter((cat) => cat.category === value))
			break
		case "tag":
			replayRandomImage(CatsDB.filter((cat) => cat.tags.includes(value as string)))
			break
		default:
			break
	}
}
