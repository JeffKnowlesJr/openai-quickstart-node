const Discord = require('discord.js')
const openai = require('openai').default

const dotenv = require('dotenv')
const { Client, Intents } = Discord

// Load environment variables from the .env file in the root directory
dotenv.config()

// Retrieve Discord token and OpenAI API key from environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Set the custom command prefix
const CUSTOM_COMMAND_PREFIX = '!'

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
    console.log('Sending prompt to OpenAI API:', prompt)

    const response = await openai.Completion.create({
      engine: 'gpt-4',
      prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7
    })

    console.log(
      'Received response from OpenAI API:',
      response.choices[0].text.trim()
    )

    return response.choices[0].text.trim()
  } catch (error) {
    console.error('Error during OpenAI API call:', error)
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

  // Log the received message
  console.log(`Received message: ${message.content}`)

  // Check if the message starts with the custom command prefix
  if (message.content.startsWith(CUSTOM_COMMAND_PREFIX)) {
    // Remove the custom command prefix from the message content
    const userMessage = message.content
      .substring(CUSTOM_COMMAND_PREFIX.length)
      .trim()

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

    // Log the sent response
    console.log(`Sent response: ${botResponse}`)
  }
})

// Log the Discord token before logging in (for troubleshooting)
console.log('DISCORD_TOKEN:', DISCORD_TOKEN)

// Log in to Discord with the app's token
bot.login(DISCORD_TOKEN)

// When the bot is ready, print a message to the console
bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`)
})
