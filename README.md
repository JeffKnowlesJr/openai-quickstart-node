# GPT-4 Discord Bot

This is a Discord bot that uses OpenAI's GPT-4 model for real-time context-aware conversations with users in Discord channels. The bot is customizable and manages conversation length and API usage for token optimization. It reads credentials from the `DISCORD_TOKEN` and `OPENAI_API_KEY` environment variables.

## Features

- Real-time conversation with users in Discord channels
- Context-aware conversation using conversation history
- Token optimization by managing conversation length and API usage
- Customizable command prefix
- Utilizes the GPT-4 model for generating responses

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v16.6.0 or higher)
- [npm](https://www.npmjs.com/) (v7.0.0 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gpt-4-discord-bot.git
```

2. Install dependencies:

```bash
cd gpt-4-discord-bot
npm install
```

3. Set environment variables:
   Create a .env file in the root directory and add the following:

```makefile
DISCORD_TOKEN=<your_discord_bot_token>
OPENAI_API_KEY=<your_openai_api_key>
```

Replace **`<your_discord_bot_token>`** with your Discord bot token and **`<your_openai_api_key>`** with your OpenAI API key.

## Usage

1. Start the bot:

```bash
npm start
```

2. Invite the bot to your Discord server.
3. Interact with the bot by mentioning it in a message:

```python
@Botname your message here
```

Replace **`BotName`** with the name of your bot.

```javascript
const CUSTOM_COMMAND_PREFIX = '!'
```

## License

This project is licensed under the MIT License. See the [LICENSE](https://chat.openai.com/LICENSE) file for details.
