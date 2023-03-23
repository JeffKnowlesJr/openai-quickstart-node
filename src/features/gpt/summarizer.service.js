module.exports = {
  summarize: function (conversation) {
    // Implement summarization logic here
    // For example, you can limit the conversation to the last N messages
    const maxLength = 5
    const summarizedConversation = conversation.slice(-maxLength)
    return summarizedConversation
  }
}
