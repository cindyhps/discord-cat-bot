import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js"
import dotenv from "dotenv"

import { KeepAlive } from "./server.js"
import { getCatImg } from "./api/fetchImg.js"
import { getGIF } from "./api/fetchGIF.js"
import { commands } from "./commands.js"

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
		console.log("+ Refreshing commands.")

		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

		console.log("+ Successfully reloaded commands.")
	} catch (e) {
		console.error(e)
	}
})()

// On bot logged in / connected server
client.on("ready", () => {
	console.log(`+ LOGGED IN AS ${client.user.tag}!`)
	client.user.setUsername("𝐂𝐚𝐭")
	client.user.setActivity("the Catnips", { type: ActivityType.Watching })
})

// On slash command used
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return
	console.log(interaction.options.get("search"))
	try {
		if (interaction.commandName === "cat") {
			const img = await getCatImg(interaction.options.get("tag"))
			await interaction.reply({ content: img, ephemeral: false })
		} else if (interaction.commandName === "catgif") {
			const gif = await getGIF(interaction.options.get("search"))
			await interaction.reply({ content: gif, ephemeral: false })
		} else {
			const img = await getCatImg(interaction.commandName)
			await interaction.reply({ content: img, ephemeral: false })
		}
	} catch (e) {
		console.error(e)
	}
})

// On message create
client.on("messageCreate", (message) => {
	if (message.content === ".cat") {
		message.reply("𝓜𝓮𝓸𝔀")
	}
})

// Bot Login
await client.login(TOKEN)

// Keep server alive
KeepAlive()
