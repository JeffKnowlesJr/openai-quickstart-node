require('dotenv').config()

const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const prefix = '!gpt ' // Set your desired command prefix here
const maxTokensPerMessage = 100 // Set your desired maximum tokens per message here
const maxMessagesPerConversation = 10 // Set your desired maximum messages per conversation here

module.exports = {
  openai,
  prefix,
  maxTokensPerMessage,
  maxMessagesPerConversation
}
