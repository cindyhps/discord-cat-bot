import { Client, GatewayIntentBits, REST, Routes } from "discord.js"
import dotenv from "dotenv"

dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] })
const rest = new REST({ version: "10" }).setToken(TOKEN)

const commands = [
	{
		name: "cat",
		description: "Replies with cat picture",
	},
	{
		name: "catgif",
		description: "Replies with sad cat picture",
	}
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

})

client.login(TOKEN)
