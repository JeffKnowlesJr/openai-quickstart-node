module.exports = {
  createCompletion: async function (request, openai) {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: request,
      max_tokens: 2048,
      temperature: 0.6
    })

    const response = completion.data.choices[0].text
    return response
  }
}
