import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js"
import { execa } from "execa"
import random from "random"
import dotenv from "dotenv"
import { saveLog } from "./logger.js"

import { KeepAlive } from "./server.js"
import { getCatImg } from "./api/fetchImg.js"
import { getGIF } from "./api/fetchGIF.js"
import { commands, helpEmbed } from "./commands.js"
import { categories, meows } from "./constants.js"

// Load secrets (Only for local env)
dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
let logs
let needReload = true

// Create new Client from discord.js
const client = new Client({
  restRequestTimeout: 30000,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
})

// Create new REST from discord.js
const rest = new REST({ version: "10" }).setToken(TOKEN)

const rebootReplit = () => execa("kill", ["1"])

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

  const timeStamp = new Date()

  ////////// CAT //////////
  try {
    if (interaction.commandName === "cat") {
      await interaction
        .deferReply()
        .then(async () => {
          const img = await getCatImg(interaction.options.get("tag"))
          console.log("REPLY: ", img)
          interaction.editReply(img)
        })
        .catch((e) => {
          console.error(e)
          saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR2")
        })
    }

    ////////// GIF //////////
    if (interaction.commandName === "catgif") {
      await interaction
        .deferReply()
        .then(async () => {
          const gif = await getGIF(interaction.options.get("search"))
          console.log("REPLY: ", gif)
          await interaction.editReply(gif)
        })
        .catch((e) => {
          console.error(e)
          saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR3")
        })
    }

    ////////// CATEGORY //////////
    if (categories.includes(interaction.commandName)) {
      await interaction
        .deferReply()
        .then(async () => {
          const img = await getCatImg(interaction.commandName)
          console.log("REPLY: ", img)
          await interaction.editReply(img)
        })
        .catch((e) => {
          console.error(e)
          saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR5")
        })
    }

    ////////// MEOW //////////
    if (interaction.commandName === "catmeow") {

      const user = interaction.options.get("to")
      const meow = meows[random.int(0, meows.length - 1)]
      await interaction.deferReply()
        .then(async () => {
          if (user) {
            if (user.value.startsWith("<@") && user.value.endsWith(">")) {
              await interaction.editReply(`${user.value} ${meow}`)
            } else {
              await interaction.editReply({ content: "Couldn't the find mentioned user!", ephemeral: true })
            }
          } else {
            await interaction.editReply(meow)
          }
        }).catch((e) => {
          console.error(e)
          saveLog(`[${timeStamp.toLocaleString()}] ${e}`, "CODE-ERROR6")
        })
    }

    ////////// HELP //////////
    if (interaction.commandName === "cathelp") {
      await interaction.deferReply()
        .then(async () => {
          await interaction.editReply({
            embeds: [helpEmbed],
          })
        }).catch((e) => {
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
  saveLog(e, "CLIENT-ERROR")
  rebootReplit()
})

client.on("warn", (e) => {
  console.warn("WARNING:", e)
  saveLog(e, "CLIENT-WARN")
})

client.on("debug", (e) => {
  logs += e
  console.warn("DEBUG:", e)
})

// Periodic Reboot
//setTimeout(() => {
//  rebootReplit()
//}, 2700000)

// check loadApplication promise
setTimeout(() => {
  console.log("LOG: NeedReload:", needReload)

  if (needReload) {
    rebootReplit()
  }
}, 15000)

// check dc connection promise
setTimeout(() => {
  if (!logs.includes("CONNECTED")) {
    rebootReplit()
  } else {
    console.log("LOG: Replit is running")
  }
}, 30000)

// load slash commands
await loadApplicationCommands()
  .then(() => {
    needReload = false
  })
  .catch((e) => {
    console.error(e)
    saveLog(e, "COMMAND-LOAD-ERR")
    rebootReplit()
  })

// login
await client.login(TOKEN).catch((e) => {
  console.error(e)
  saveLog(e, "CLIENT-LOGIN-ERR")
  rebootReplit()
})

// KeepAlive()
