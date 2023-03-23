const Discord = require('discord.js')
const openai = require('openai')
const dotenv = require('dotenv')
const { Client, Intents } = Discord

// Load environment variables from the .env file
dotenv.config()

// Retrieve Discord token and OpenAI API key from environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Set the custom command prefix
const CUSTOM_COMMAND_PREFIX = '!gpt'

// Initialize the conversation history object to store context
const conversationHistory = {}

// Set the OpenAI API key
openai.apiKey = OPENAI_API_KEY

/**
 * Generate a GPT-4 response based on the provided prompt.
 * @param {string} prompt - The conversation history prompt.
 * @returns {string} The generated GPT-4 response.
 */
async function generateGpt4Response(prompt) {
  try {
    const response = await openai.Completion.create({
      engine: 'gpt-4',
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7
    })

    return response.choices[0].text.trim()
  } catch (error) {
    console.error(error)
  }
}

// Create a new Discord client with required intents
const bot = new Client({
  intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})

// Listen for the 'messageCreate' event
bot.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return

  // Check if the bot is mentioned in the message
  if (message.mentions.has(bot.user)) {
    // Remove the bot mention from the message content
    const userMessage = message.content.replace(`<@!${bot.user.id}>`, '').trim()

    // Get the conversation ID based on the channel ID
    const conversationId = message.channelId

    // Update the conversation history
    if (conversationHistory.hasOwnProperty(conversationId)) {
      conversationHistory[conversationId].push(`User: ${userMessage}`)
    } else {
      conversationHistory[conversationId] = [`User: ${userMessage}`]
    }

    // Generate the prompt for GPT-4 using the conversation history
    const prompt = conversationHistory[conversationId].join('\n')

    // Get the bot response from GPT-4
    const botResponse = await generateGpt4Response(prompt)

    // Update the conversation history with the bot response
    conversationHistory[conversationId].push(`Bot: ${botResponse}`)

    // Send the bot response in the Discord channel
    await message.channel.send(botResponse)
  }
})

// Log the Discord token before logging in (for troubleshooting)
console.log('DISCORD_TOKEN:', DISCORD_TOKEN)

// Log in to the Discord bot
bot.login(DISCORD_TOKEN)
