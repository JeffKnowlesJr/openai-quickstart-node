require('dotenv').config()
const { Client } = require('discord.js')
const intents = require('./utils/intents')
const { handleMessage } = require('./features/gpt/gpt.controller')

const client = new Client({ intents })
const prefix = '!gpt '

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', async (message) => {
  handleMessage(message, prefix)
})

client.login(process.env.DISCORD_TOKEN)
