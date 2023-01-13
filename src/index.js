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
  ; (async () => {
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
      // cat | cat<tag>
      
      await interaction
        .deferReply()
        .then(async () => {

          // log
          const l1_date = new Date();
          console.log(`[${l1_date.toLocaleString()}]+ COMMAND:`, interaction.commandName)
          
          try {
            const img = await getCatImg(interaction.options.get("tag"))
            interaction.editReply(img)
          } catch (e) {
            console.log("Error on '/cat':", e)
          }
          
        })
        .catch((e) => {
          console.error(e)
        })
    } else if (interaction.commandName === "catgif") {
      // catgif | catgif<search>
      
      await interaction
        .deferReply()
        .then(async () => {
          
          // log
          const l2_date = new Date();
          console.log(`[${l2_date.toLocaleString()}]+ COMMAND:`, interaction.commandName)

          try {
            const gif = await getGIF(interaction.options.get("search"))
            interaction.editReply(gif)
          } catch (e) {
            console.log("Error on '/catgif':", e)
          }

        })
        .catch((e) => console.error(e))
      
    } else if (interaction.commandName === "catmeow") {
      // catmeow | catmeow<to>

      const user = interaction.options.get("to")
      const meow = meows[random.int(0, meows.length - 1)]

      if (user) {
        if (user.value.startsWith("<@") && user.value.endsWith(">")) {
          interaction.reply(`${user.value} ${meow}`)
        } else {
          interaction.reply({ content: "Couldn't the find mentioned user!", ephemeral: true })
        }
      } else {
        interaction.reply(meow)
      }

    } else {
      // cat:category

      await interaction
        .deferReply()
        .then(async () => {

          // log
          const l3_date = new Date();
          console.log(`[${l3_date.toLocaleString()}]+ COMMAND:`, interaction.commandName)

          try {
            const img = await getCatImg(interaction.commandName)
            interaction.editReply(img)
          } catch (e) {
            console.log("Error on 'cat:category:", e)
          }

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
