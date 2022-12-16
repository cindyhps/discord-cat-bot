import { Client, GatewayIntentBits, REST, Routes } from "discord.js"
import dotenv from "dotenv"
import { KeepAlive } from "./server.js"
import { getCatImg } from "./api/fetchImg.js"

dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})
const rest = new REST({ version: "10" }).setToken(TOKEN)

const commands = [
	{
		name: "cat",
		description: "Replies with a casual cat picture",
	},
	{
		name: "catgif",
		description: "Replies with cat gif",
	},
	{
		name: "catmeme",
		description: "Replies with a cat meme",
	},
	{
		name: "catcasual",
		description: "Replies with a casual cat picture",
	},
	{
		name: "catemotion",
		description: "Replies with a emotional cat picture",
	},
	{
		name: "catmental",
		description: "Replies with a cat image about mental health",
	},
	{
		name: "catlove",
		description: "Replies with a in love cat picture",
	},
]

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
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	if (interaction.commandName === "cat") {
		await interaction.reply("https://i.pinimg.com/564x/2e/ed/30/2eed301af40aebd2d77cff2fa3d6eeee.jpg")
	}

	if (interaction.commandName === "catgif") {
		await interaction.reply("https://media.tenor.com/7r-BGEoIohkAAAAC/meme-cat.gif")
	}

	if (interaction.commandName === "catmeme") {
		const img = await getCatImg("meme")
		await interaction.reply(img)
	}

	if (interaction.commandName === "catcasual") {
		const img = await getCatImg("casual")
		await interaction.reply(img)
	}

	if (interaction.commandName === "catemotion") {
		const img = await getCatImg("emotion")
		await interaction.reply(img)
	}

	if (interaction.commandName === "catlove") {
		const img = await getCatImg("love")
		await interaction.reply(img)
	}
})

client.on("messageCreate", (message) => {
	if (message.content === ".cat") {
		message.reply("https://i.pinimg.com/736x/57/15/52/57155231eef543cd4169e58f33b7d243.jpg")
	}
})

KeepAlive()
client.login(TOKEN)
