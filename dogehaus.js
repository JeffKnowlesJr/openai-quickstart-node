/* 
Instructions:
1. Load environment variables
2. Import required packages
3. Configure OpenAI API
4. Create Discord client with necessary intents
5. Define command prefix
6. Add event listener for client ready state
7. Add event listener for message creation
8. Ignore messages from bots, non-text channels, and messages without prefix
9. Send API request to OpenAI
10. Send OpenAI response as a message in Discord
*/

require('dotenv').config() // 1. Load environment variables
const { Client, GatewayIntentBits } = require('discord.js') // 2. Import required packages
const { Configuration, OpenAIApi } = require('openai') // 2. Import required packages

const configuration = new Configuration({
  // 3. Configure OpenAI API
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

const client = new Client({
  // 4. Create Discord client with necessary intents
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const prefix = '!gpt ' // 5. Define command prefix

client.on('ready', () => {
  // 6. Add event listener for client ready state
  console.log(`Logged in as ${client.user.tag}! \n ----`)
})

client.on('messageCreate', async (message) => {
  // 7. Add event listener for message creation
  console.log(`Message received: \n ${message} \n ----`)
  const messageContent = JSON.stringify(message)
  console.log(`Message Object: \n ${messageContent} \n ----`)

  // 8. Ignore messages from bots, non-text channels, and messages without prefix
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
    // 9. Send API request to OpenAI
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: request,
      max_tokens: 600,
      temperature: 0.6
    })
    const response = completion.data.choices[0].text
    // 10. Send OpenAI response as a message in Discord
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
