const openai = require('../../config/openai')
const { createCompletion } = require('./gpt.service')

const conversationHistory = new Map()

module.exports = {
  handleMessage: async function (message, prefix) {
    if (
      message.author.bot ||
      !message.content.startsWith(prefix) ||
      message.channel.type !== 0
    ) {
      return
    }

    const channelId = message.channel.id

    if (!conversationHistory.has(channelId)) {
      conversationHistory.set(channelId, [])
    }

    const userMessage = message.content.slice(prefix.length).trim()
    conversationHistory.get(channelId).push({
      role: 'user',
      content: userMessage
    })

    const request = conversationHistory
      .get(channelId)
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
