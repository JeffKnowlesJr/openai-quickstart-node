const openai = require('../../config/openai')
const { createCompletion } = require('./gpt.service')

module.exports = {
  handleMessage: async function (message, prefix) {
    if (
      message.author.bot ||
      !message.content.startsWith(prefix) ||
      message.channel.type !== 0
    ) {
      return
    }

    const request = message.content

    try {
      const response = await createCompletion(request, openai)
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
