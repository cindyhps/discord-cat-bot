import { SlashCommandBuilder } from "discord.js"

const catGif = new SlashCommandBuilder()
	.setName("catgif")
	.setDescription("Replies with a cat gif")
	.addStringOption((subCommand) =>
		subCommand
			.setName("search")
			.setDescription("Replies with a gif according to the specified search.")
	)

const cat = new SlashCommandBuilder()
	.setName("cat")
	.setDescription("Replies with a random cat picture")
	.addStringOption((subCommand) =>
		subCommand
			.setName("tag")
			.setDescription("Replies with a img according to the specified tag.")
	)

export const commands = [
	cat,
	catGif,
	{
		name: "catmeme",
		description: "Replies with a cat meme",
	},
	{
		name: "catmemelove",
		description: "Replies with a in love cat meme",
	},
	{
		name: "catcasual",
		description: "Replies with a casual cat picture",
	},
	{
		name: "catfeels",
		description: "Responds with a picture of a cat that expresses any feeling",
	},
	{
		name: "catmental",
		description: "Replies with a cat image about mental health",
	},
	{
		name: "catlove",
		description: "Replies with a in love cat picture",
	},
	{
		name: "catreact",
		description: "Replies with a reaction picture of a cat",
	},
	{
		name: "catedit",
		description: "Replies with a edited cat picture",
	},
]
