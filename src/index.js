import { Client, GatewayIntentBits, REST, Routes } from "discord.js"
import dotenv from "dotenv"
import { KeepAlive } from "./server.js"
import { getCatImg } from "./api/fetchImg.js"
import { commands } from "./commands.js"

dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})
const rest = new REST({ version: "10" }).setToken(TOKEN)

;(async () => {
	try {
		console.log("Started refreshing application (/) commands.")

		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

		console.log("Successfully reloaded application (/) commands.")
	} catch (error) {
		console.error(error)
	}
})()

client.on("ready", () => {
	console.log(`LOGGED IN AS ${client.user.tag}!`)
})

// On slash command used
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const cmd = interaction.commandName

	if (cmd === "cat") {
		const img = await getCatImg()
		await interaction.reply(img)
	} else if (cmd === "catgif") {
		await interaction.reply("https://media.tenor.com/7r-BGEoIohkAAAAC/meme-cat.gif")
	} else {
		const img = await getCatImg(cmd)
		await interaction.reply(img)
	}
})


// On message create
client.on("messageCreate", (message) => {
	if (message.content === ".cat") {
		message.reply("https://i.pinimg.com/736x/57/15/52/57155231eef543cd4169e58f33b7d243.jpg")
	}
})

KeepAlive()
client.login(TOKEN)
