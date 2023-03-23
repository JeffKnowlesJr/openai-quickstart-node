const openai = require('../../config/openai')
const { createCompletion } = require('./gpt.service')
const { summarize } = require('./summarizer.service')

// ... (other code remains the same)

module.exports = {
  handleMessage: async function (message, prefix) {
    // ... (previous code remains the same)

    const channelId = message.channel.id

    if (!conversationHistory.has(channelId)) {
      conversationHistory.set(channelId, [])
    }

    const userMessage = message.content.slice(prefix.length).trim()
    conversationHistory.get(channelId).push({
      role: 'user',
      content: userMessage
    })

    // Summarize the conversation history
    const summarizedConversation = summarize(conversationHistory.get(channelId))

    const request = summarizedConversation
      .map((message) => {
        return `${message.role}: ${message.content}`
      })
      .join('\n')

    try {
      const response = await createCompletion(request, openai)
      conversationHistory.get(channelId).push({
        role: 'bot',
        content: response
      })

      message.channel.send(response)
    } catch (error) {
      if (error.response) {
        console.error(error.response.status, error.response.data)
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`)
      }
    }
  }
}
