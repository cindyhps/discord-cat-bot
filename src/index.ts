import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js"
// import { execa } from "execa"
import random from "random"
import dotenv from "dotenv"

import fetchGIF from "./api/fetchGIF"
import fetchCatImage from "./api/fetchCatImage"

import { saveLog } from "./logger"
import { KeepAlive } from "./server"
import { commands, helpEmbed } from "./commands"
import { categories, meows } from "./constants"

dotenv.config()

const TOKEN = process.env.TOKEN || ""
const CLIENT_ID = process.env.CLIENT_ID || ""

let logs = ""
const notFound = "Sorry, I couldn't find any images for that tag."
// let needReload = true

const client = new Client({
	closeTimeout: 60000,
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

const rest = new REST({ version: "10" }).setToken(TOKEN)

// const rebootReplit = () => execa("kill", ["1"])

client.on("ready", () => {
	console.log(`LOG: Bot logged in`)
	client.user?.setActivity(`the Catnips`, { type: ActivityType.Watching })
})

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const timeStamp = new Date()

	////////// CAT //////////
	try {
		if (interaction.commandName === "cat") {
			await interaction
				.deferReply()
				.then(async () => {
					const img = fetchCatImage(interaction.options.get("tag"))
					console.log("REPLY: ", img)
					interaction.editReply({
						files: img ? [img] : undefined,
						content: img ? undefined : notFound,
					})
				})
				.catch((e) => {
					console.error(e)
					saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR2")
				})
		}

		////////// CATEGORY //////////
		if (categories.includes(interaction.commandName)) {
			await interaction
				.deferReply()
				.then(async () => {
					const img = fetchCatImage(interaction.commandName)
					console.log("REPLY: ", img)
					interaction.editReply({
						files: img ? [img] : undefined,
						content: img ? undefined : notFound,
					})
				})
				.catch((e) => {
					console.error(e)
					saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR5")
				})
		}

		////////// GIF //////////
		if (interaction.commandName === "catgif") {
			await interaction
				.deferReply()
				.then(async () => {
					const gif = await fetchGIF(interaction.options.get("search"))
					console.log("REPLY: ", gif)
					await interaction.editReply(gif)
				})
				.catch((e) => {
					console.error(e)
					saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR3")
				})
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
					console.error(e)
					saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR6")
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
					saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR7")
				})
		}
	} catch (e) {
		console.error(e)
		saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR8")
	}
})

client.on("error", (e) => {
	console.error("ERROR:", e)
	saveLog(JSON.stringify(e), "CLIENT-ERROR")
	// rebootReplit()
})

client.on("warn", (e) => {
	console.warn("WARNING:", e)
	saveLog(e, "CLIENT-WARN")
})

client.on("debug", (e) => {
	logs += e
	console.warn("DEBUG:", e)
})

//setTimeout(() => {
//  rebootReplit()
//}, 2700000)

// setTimeout(() => {
// 	console.log("LOG: NeedReload:", needReload)

// 	if (needReload) {
// 		rebootReplit()
// 	}
// }, 15000)

// setTimeout(() => {
// 	if (!logs.includes("CONNECTED")) {
// 		rebootReplit()
// 	} else {
// 		console.log("LOG: Replit is running")
// 	}
// }, 30000)

const loadApplicationCommands = async () => {
	try {
		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
		console.log("LOG: Successfully loaded commands.")
	} catch (e) {
		console.error(e)
	}
}

loadApplicationCommands()
	.then(() => {
		// needReload = false

		client.login(TOKEN).catch((e) => {
			console.error(e)
			saveLog(e, "CLIENT-LOGIN-ERR")
			// rebootReplit()
		})
	})
	.catch((e) => {
		console.error(e)
		saveLog(e, "COMMAND-LOAD-ERR")
		// rebootReplit()
	})

KeepAlive()
