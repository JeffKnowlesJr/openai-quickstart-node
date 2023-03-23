const Discord = require('discord.js')
const axios = require('axios')
const dotenv = require('dotenv')
const { Client, Intents } = Discord

dotenv.config()

const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const CUSTOM_COMMAND_PREFIX = '!'

const conversationHistory = {}

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1/engines/gpt-4/completions',
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`
  }
})

async function generateGpt4Response(prompt) {
  try {
    const response = await openaiClient.post('', {
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7
    })

    return response.data.choices[0].text.trim()
  } catch (error) {
    console.error(error)
  }
}

const bot = new Client({
  intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})

bot.on('messageCreate', async (message) => {
  if (message.author.bot) return

  if (message.mentions.has(bot.user)) {
    const userMessage = message.content.replace(`<@!${bot.user.id}>`, '').trim()
    const conversationId = message.channelId
    if (conversationHistory.hasOwnProperty(conversationId)) {
      conversationHistory[conversationId].push(`User: ${userMessage}`)
    } else {
      conversationHistory[conversationId] = [`User: ${userMessage}`]
    }

    const prompt = conversationHistory[conversationId].join('\n')

    const botResponse = await generateGpt4Response(prompt)

    conversationHistory[conversationId].push(`Bot: ${botResponse}`)

    await message.channel.send(botResponse)
  }
})

bot.login(DISCORD_TOKEN)
