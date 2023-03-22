require('dotenv').config() // load environment variables
const { Client, GatewayIntentBits } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const prefix = '!gpt ' // Set your desired command prefix here

const openaiApiKey = process.env.OPENAI_API_KEY

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! \n ----`)
})

client.on('messageCreate', async (message) => {
  console.log(`Message received: \n ${message} \n ----`)
  const messageContent = JSON.stringify(message)
  console.log(`Message Object: \n ${messageContent} \n ----`)
  // ignore messages from bots, non-text channels, and messages without prefix
  if (
    message.author.bot ||
    !message.content.startsWith(prefix) ||
    message.channel.type !== 0
  ) {
    console.log(`process ended \n ----`)
    return
  }
  const request = message.content

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: request,
      max_tokens: 600,
      temperature: 0.6
    })
    const response = completion.data.choices[0].text
    message.channel.send(response)
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
    }
  }
})

client.login(process.env.DISCORD_TOKEN) // login to Discord
