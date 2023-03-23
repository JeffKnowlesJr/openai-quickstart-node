const { Client, Intents } = require('discord.js')
const conversationContext = require('./conversationContext')
const conversationLengths = require('./conversationLengths')
const {
  openai,
  prefix,
  maxTokensPerMessage,
  maxMessagesPerConversation
} = require('./config')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! \n ----`)
})

client.on('messageCreate', async (message) => {
  console.log(`Message received: \n ${message} \n ----`)
  const messageContent = message.content
  console.log(`Message Content: \n ${messageContent} \n ----`)
  const messageAuthorId = message.author.id
  const messageChannelId = message.channel.id

  // Ignore messages from bots, non-text channels, and messages without prefix
  if (
    message.author.bot ||
    !message.content.startsWith(prefix) ||
    message.channel.type !== 'GUILD_TEXT'
  ) {
    console.log(`Process ended \n ----`)
    return
  }

  // Get conversation history for the user or channel
  let conversationHistory = conversationContext.get(messageAuthorId)
  if (!conversationHistory) {
    conversationHistory = []
  }

  // Append the new message to the conversation history
  conversationHistory.push(messageContent)

  // Limit the conversation history to maxMessagesPerConversation messages
  if (conversationHistory.length > maxMessagesPerConversation) {
    conversationHistory.shift()
  }

  // Update the conversation history in the store
  conversationContext.set(messageAuthorId, conversationHistory)

  // Create prompt for OpenAI API by concatenating conversation history and new message
  const prompt = conversationHistory.join(' ') + ' ' + messageContent

  // Get the length of the current conversation
  let conversationLength = conversationLengths.get(messageAuthorId)
  if (!conversationLength) {
    conversationLength = 0
  }

  // Check if the conversation has reached the token limit
  if (conversationLength + prompt.split(' ').length > maxTokensPerMessage) {
    console.log(
      `Token limit reached for conversation with user ${messageAuthorId} \n ----`
    )
    message.channel.send(
      "Sorry, I am out of tokens for this conversation. Let's chat later!"
    )
    return
  }

  // Call OpenAI API to generate response
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: maxTokensPerMessage,
      temperature: 0.1
    })

    const response = completion.data.choices[0].text.trim()

    // Store the response in the conversation history
    conversationHistory.push(response)

    // Limit the conversation history to maxMessagesPerConversation messages
    if (conversationHistory.length > maxMessagesPerConversation) {
      conversationHistory.shift()
    }

    // Update the conversation history in the store
    conversationContext.set(messageAuthorId, conversationHistory)

    // Update the conversation length
    conversationLength += prompt.split(' ').length + response.split(' ').length
    conversationLengths.set(messageAuthorId, conversationLength)

    // Send the generated response to
    message.channel.send(response)
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(error)
    }
  }
})

client.login(process.env.DISCORD_TOKEN) // login to Discord

module.exports = client
