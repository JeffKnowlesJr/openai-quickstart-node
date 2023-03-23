const { OpenAIApi, Configuration } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

/**
 * Generates a response from the OpenAI API given the conversation history and a new message.
 * @param {Array<string>} conversationHistory The conversation history.
 * @param {string} messageContent The new message content.
 * @param {number} maxTokensPerMessage The maximum number of tokens per message.
 * @param {number} conversationLength The length of the conversation.
 * @param {number} maxMessagesPerConversation The maximum number of messages per conversation.
 * @returns {Promise<string>} A promise that resolves to the generated response.
 */
async function generateResponse(
  conversationHistory,
  messageContent,
  maxTokensPerMessage,
  conversationLength,
  maxMessagesPerConversation
) {
  // Append the new message to the conversation history
  conversationHistory.push(messageContent)

  // Limit the conversation history to maxMessagesPerConversation messages
  if (conversationHistory.length > maxMessagesPerConversation) {
    conversationHistory.shift()
  }

  // Update the conversation length
  conversationLength += messageContent.split(' ').length

  // Create prompt for OpenAI API by concatenating conversation history and new message
  const prompt = conversationHistory.join(' ') + ' ' + messageContent

  // Check if the conversation has reached the token limit
  if (conversationLength > maxTokensPerMessage) {
    throw new Error(
      `Token limit reached for conversation: ${conversationHistory.join(' ')}`
    )
  }

  // Call OpenAI API to generate response
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: maxTokensPerMessage - conversationLength,
    temperature: 0.1
  })

  const response = completion.data.choices[0].text.trim()

  // Store the response in the conversation history
  conversationHistory.push(response)

  // Limit the conversation history to maxMessagesPerConversation messages
  if (conversationHistory.length > maxMessagesPerConversation) {
    conversationHistory.shift()
  }

  return response
}

module.exports = {
  generateResponse
}
