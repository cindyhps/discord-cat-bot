import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js"
import { execa } from 'execa';
import random from "random"
import dotenv from "dotenv"
import { saveLog } from "./logger.js"

import { KeepAlive } from "./server.js"
import { getCatImg } from "./api/fetchImg.js"
import { getGIF } from "./api/fetchGIF.js"
import { commands } from "./commands.js"
import { meows } from "./constants.js"


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

const rebootReplit = () => execa('kill', ['1']);

// Load application commands
const loadApplicationCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    console.log("LOG: Successfully loaded commands.")
  } catch (e) {
    console.error(e)
  }
}

// On bot logged in / connected server
client.on("ready", () => {
  console.log(`LOG: Bot logged in`)
  client.user.setActivity(`the Catnips`, { type: ActivityType.Watching })
})

// On slash command used
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  const timeStamp = new Date();

  try {
    if (interaction.commandName === "cat") {
      // cat | cat<tag>

      await interaction
        .deferReply()
        .then(async () => {

          try {
            const img = await getCatImg(interaction.options.get("tag"))
            interaction.editReply(img)
          } catch (e) {
            saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR")
          }

        })
        .catch((e) => {
          console.error(e)
          saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR")
        })
    } else if (interaction.commandName === "catgif") {
      // catgif | catgif<search>

      await interaction
        .deferReply()
        .then(async () => {

          try {
            const gif = await getGIF(interaction.options.get("search"))
            interaction.editReply(gif)
          } catch (e) {
            console.log("Error on '/catgif':", e)
            saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR")
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

          try {
            const img = await getCatImg(interaction.commandName)
            interaction.editReply(img)
          } catch (e) {
            console.log("Error on 'cat:category:", e)
            saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR")
          }

        })
        .catch((e) => {
          console.error(e)
          saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR")
        })
    }
  } catch (e) {
    console.error(e)
    saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR")
  }
})

client.on("error", (e) => {
  console.error("ERROR:", e)
  saveLog(e, "CLIENT-ERROR")
  rebootReplit()
});

client.on("warn", (e) => {
  console.warn("WARNING:", e)
  saveLog(e, "CLIENT-WARN")
});

client.on("debug", (e) => {
  console.info("INFO:", e)
});

await loadApplicationCommands()
  .catch((e) => {
    console.error(e)
    saveLog(e, "COMMAND-LOAD-ERR")
    rebootReplit()
  })

await client.login(TOKEN)
  .catch((e) => {
    console.error(e)
    saveLog(e, "CLIENT-LOGIN-ERR")
    rebootReplit()
  })

KeepAlive()
