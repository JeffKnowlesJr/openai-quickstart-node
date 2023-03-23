const { GatewayIntents } = require('discord.js')
const { OpenAIApi, Configuration } = require('openai')
const { updateConversationContext } = require('./gpt.service')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const maxTokensPerMessage = 100
const maxMessagesPerConversation = 10
const conversationLengths = new Map()

module.exports = async (message) => {
  const { author, channel, content, guild } = message
  const { id: authorId } = author
  const { id: channelId } = channel
  const { id: guildId } = guild

  // Ignore messages from bots, non-text channels, and messages without prefix
  if (
    author.bot ||
    !content.startsWith('!gpt') ||
    channel.type !== 'GUILD_TEXT'
  ) {
    return
  }

  // Get conversation history for the user or channel
  const conversationHistory = updateConversationContext({
    authorId,
    channelId,
    content
  })

  // Create prompt for OpenAI API by concatenating conversation history and new message
  const prompt = conversationHistory.join(' ')

  // Get the length of the current conversation
  let conversationLength = conversationLengths.get(authorId) || 0

  // Check if the conversation has reached the token limit
  if (conversationLength + prompt.split(' ').length > maxTokensPerMessage) {
    console.log(`Token limit reached for conversation with user ${authorId}`)
    channel.send(
      "Sorry, I am out of tokens for this conversation. Let's chat later!"
    )
    return
  }

  // Call OpenAI API to generate response
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
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

    // Update the conversation length
    conversationLength += prompt.split(' ').length + response.split(' ').length
    conversationLengths.set(authorId, conversationLength)

    // Send the generated response to the channel
    channel.send(response)
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
    }
  }
}
