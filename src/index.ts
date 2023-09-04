import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js"
// import { execa } from "execa"
import random from "random"
import dotenv from "dotenv"

import fetchGIF from "./api/fetchGIF"
import fetchImage from "./api/fetchImage"

import { saveLog } from "./logger"
import { KeepAlive } from "./server"
import { commands, helpEmbed } from "./commands"
import { categories, meows } from "./constants"

dotenv.config()

const TOKEN = process.env.TOKEN as string
const CLIENT_ID = process.env.CLIENT_ID as string
let needReload = true

const rest = new REST({ version: "10" }).setToken(TOKEN)

const client = new Client({
	closeTimeout: 60000,
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

// kill 1 && yarn start
// const rebootReplit = () => execa("kill", ["1"]).then(() => execa("yarn", ["start"]))

client.on("ready", () => {
	needReload = false
	console.debug(`LOG: Bot logged in`)
	client.user?.setActivity(`the Catnips`, { type: ActivityType.Watching })
})

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const timeStamp = new Date().toLocaleString()

	try {
		////////// RANDOM <|> TAG //////////
		if (interaction.commandName === "cat") {
			const value = interaction.options.get("tag")?.value?.toString()
			await interaction
				.deferReply()
				.then(async () => await fetchImage(interaction, value))
				.catch((e) => saveLog(`[${timeStamp}] ${e}`, "1"))
		}

		////////// CATEGORY //////////
		if (categories.includes(interaction.commandName)) {
			await interaction
				.deferReply()
				.then(async () => await fetchImage(interaction, interaction.commandName))
				.catch((e) => saveLog(`[${timeStamp}-2] ${e}`, "2"))
		}

		////////// GIF //////////
		if (interaction.commandName === "catgif") {
			const search = interaction.options.get("search")?.value?.toString()
			await interaction
				.deferReply()
				.then(async () => await fetchGIF(interaction, search))
				.catch((e) => saveLog(`[${timeStamp}] ${e}`, "3"))
		}

		////////// MEOW //////////
		if (interaction.commandName === "catmeow") {
			const user = interaction.options.get("to")
			const meow = meows[random.int(0, meows.length - 1)]
			await interaction
				.deferReply()
				.then(async () => {
					if (user) {
						if (typeof user.value === "string" && user.value?.startsWith("<@") && user.value?.endsWith(">")) {
							await interaction.editReply(`${user.value} ${meow}`)
						} else {
							await interaction.editReply({ content: "Couldn't the find mentioned user!" })
						}
					} else {
						await interaction.editReply(meow)
					}
				})
				.catch((e) => {
					saveLog(`[${timeStamp}] ${e}`, "CODE-ERROR6")
				})
		}

		////////// HELP //////////
		if (interaction.commandName === "cathelp") {
			await interaction
				.deferReply()
				.then(async () => {
					await interaction.editReply({
						embeds: [helpEmbed],
					})
				})
				.catch((e) => {
					console.error(e)
					saveLog(`[${timeStamp}] ${e}`, "CODE-ERROR7")
				})
		}
	} catch (e) {
		console.error(e)
		saveLog(`[${timeStamp}] ${e}`, "CODE-ERROR8")
	}
})

client.on("error", (e) => {
	saveLog(JSON.stringify(e), "CLIENT-ERROR")
})

client.on("warn", (e) => {
	saveLog(JSON.stringify(e), "CLIENT-WARN")
})

setTimeout(() => {
	console.debug("LOG: NeedReload:", needReload)
	// if (needReload) rebootReplit()
}, 60000)

rest
	.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
	.then(async () => await client.login(TOKEN))
	.catch((e) => saveLog(e, "LOAD-ERROR"))

KeepAlive()
