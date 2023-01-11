import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js"
import dotenv from "dotenv"

import { KeepAlive } from "./server.js"
import { getCatImg } from "./api/fetchImg.js"
import { getGIF } from "./api/fetchGIF.js"
import { commands } from "./commands.js"
import { meows } from "./constants.js"
import random from "random"

// Load secrets (Only for local env)
dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

// Create new Client from discord.js
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
})

// Create new REST from discord.js
const rest = new REST({ version: "10" }).setToken(TOKEN)

// Load application commands
;(async () => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
		console.log("+ Successfully reloaded commands.")
	} catch (e) {
		console.error(e)
	}
})()

// On bot logged in / connected server
client.on("ready", () => {
	console.log(`+ Bot logged in`)
	client.user.setActivity(`the Catnips`, { type: ActivityType.Watching })
})

// On slash command used
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	try {
		if (interaction.commandName === "cat") {
			// IMG RANDOM OR VIA TAG
			await interaction
				.deferReply()
				.then(async () => {
					const img = await getCatImg(interaction.options.get("tag"))
					await interaction.editReply({ content: img })
				})
				.catch((e) => {
					console.error(e)
				})
		} else if (interaction.commandName === "catgif") {
			// GIF
			await interaction
				.deferReply()
				.then(async () => {
					const gif = await getGIF(interaction.options.get("search"))
					await interaction.editReply({ content: gif })
				})
				.catch((e) => console.error(e))
		} else if (interaction.commandName === "catmeow") {
			// MEOW
			const user = interaction.options.get("to")
			const meow = meows[random.int(0, meows.length - 1)]

			if (user && user.value.startsWith("<@") && user.value.endsWith(">")) {
				interaction.reply(`${user.value} ${meow}`)
			} else {
				interaction.reply({ content: "Couldn't the find mentioned user!", ephemeral: true })
			}
		} else {
			// IMG VIA CATEGORIES
			await interaction
				.deferReply()
				.then(async () => {
					const img = await getCatImg(interaction.commandName)
					await interaction.editReply({ content: img })
				})
				.catch((e) => {
					console.error(e)
				})
		}
	} catch (e) {
		console.error(e)
	}
})

// Bot Login
await client.login(TOKEN)

// Keep server alive
KeepAlive()
