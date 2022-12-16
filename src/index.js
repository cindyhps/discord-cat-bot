const { Client, GatewayIntentBits, REST, Routes } = require("discord.js")
const dotenv = require("dotenv")
const KeepAlive = require("./server")
const { getCatImg } = require("./api/fetchImg")

dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})
const rest = new REST({ version: "10" }).setToken(TOKEN)

const commands = [
  {
    name: "cat",
    description: "Replies with a casual cat picture",
  },
  {
    name: "catmeme",
    description: "Replies with a cat meme",
  },
  {
    name: "catgif",
    description: "Replies with cat gif",
  },
]

  ; (async () => {
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
    await getCatImg().then( async (res) => {
      await interaction.reply(res)
    })
  }
})

client.on("messageCreate", (message) => {
  if (message.content === ".cat") {
    message.reply("https://i.pinimg.com/736x/57/15/52/57155231eef543cd4169e58f33b7d243.jpg")
  }
})

KeepAlive()
client.login(TOKEN)
