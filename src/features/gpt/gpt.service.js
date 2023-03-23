module.exports = {
  createCompletion: async function (request, openai) {
    const prompt = `Conversation:\n${request}\n\nbot:`

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 4096,
      temperature: 0.6,
      n: 1
    })

    const response = completion.data.choices[0].text.trim()
    return response
  }
}
