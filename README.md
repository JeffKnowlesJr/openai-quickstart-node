# OpenAI Discord Bot

A Discord bot powered by OpenAI's GPT, designed to engage in context-aware conversations and generate coherent responses.

## Features

- Real-time conversation with users in Discord channels
- Context-aware conversation using conversation history
- Token optimization by managing conversation length and API usage
- Customizable command prefix

## Proposed File Structure

app
└── src
├── config
│ └── openai.js
├── features
│ └── gpt
│ ├── gpt.controller.js
│ ├── gpt.service.js
│ └── utils
│ ├── intents.js
├── index.js
├── .env
├── package.json
└── README.md

## Conversation Context Feature

The Conversation Context feature enables the bot to maintain a context-aware conversation with users by keeping track of the conversation history for each user or channel. This history is then sent as part of the prompt to the OpenAI API, ensuring that the generated responses are contextually relevant and coherent.

### How it works

1. **Store conversation history**: The bot stores the conversation history for each user or channel in a data structure, such as an object or a Map.

2. **Update conversation history**: When a new message is received, the bot appends the message to the corresponding user's or channel's conversation history.

3. **Create API prompt**: The bot concatenates the conversation history and the new message to create the prompt for the OpenAI API.

4. **Send prompt to OpenAI API**: The concatenated prompt is sent to the OpenAI API, which generates a contextually relevant and coherent response based on the conversation history.

5. **Update conversation history with response**: The bot stores the generated response in the conversation history for the user or channel.

6. **Send response to user or channel**: The bot sends the generated response back to the user or channel, maintaining a context-aware conversation.

### Example

User: "Tell me a joke."
Bot: "Why did the chicken cross the road? To get to the other side!"

User: "That's an old one. Tell me another."
Bot: "Sure, here's another one: Why don't scientists trust atoms? Because they make up everything!"

As shown in the example above, the bot is able to maintain context and generate coherent responses by leveraging the Conversation Context feature.
