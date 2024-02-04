import { EmbedBuilder } from "discord.js"
import { commandsList, donateUrl, voteUrl } from "./constants.js"

export const helpEmbed = new EmbedBuilder()
	.setColor("#661E84")
	.setTitle("Command List")
	.setAuthor({
		name: "Cat",
		iconURL: "https://raw.githubusercontent.com/Kaosc/discord-cat-bot/master/assets/cat_128.png",
	})
	.addFields(commandsList)

export const donateEmbed = new EmbedBuilder()
	.setColor("#661E84")
	.setTitle("Buy catnip to keep the cat alive!")
	.setDescription(donateUrl)
	.setThumbnail("https://raw.githubusercontent.com/Kaosc/discord-cat-bot/master/assets/catnip.png")
	.setAuthor({
		name: "Cat",
		iconURL: "https://raw.githubusercontent.com/Kaosc/discord-cat-bot/master/assets/cat_128.png",
	})

export const voteEmbed = new EmbedBuilder()
	.setColor("#661E84")
	.setTitle("Vote for the Cat!")
	.setDescription(voteUrl)
	.setThumbnail("https://raw.githubusercontent.com/Kaosc/discord-cat-bot/master/assets/vote.png")
	.setAuthor({
		name: "Cat",
		iconURL: "https://raw.githubusercontent.com/Kaosc/discord-cat-bot/master/assets/cat_128.png",
	})
