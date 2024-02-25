# steam-comment-bot-discord-plugin
Discord plugin for the [steam-comment-service-bot](https://github.com/3urobeat/steam-comment-service-bot).

This plugin adds support for executing bot commands & receiving responses through Discord.

Setting it up is very simple, you just need to provide a Discord Bot token and invite the corresponding Bot to your server. It is explained below:

&nbsp;

## Setup
The plugin is installed in your `steam-comment-service-bot` installation by default.  
Please make sure you have the latest version of the Bot installed!  

> **Note:** Make sure to have at least node.js v16.11 installed, as it is required by discord.js

To enable the plugin, make sure you have started the bot at least once.  
Then, open the `plugin` folder, as well as the `steam-comment-bot-discord-plugin` folder inside.  

Use a text editor to open the `config.json` file inside.  
Change the value for `enabled` from `false` to `true`.  
Create a Discord Bot in your [Discord Developer Dashboard](https://discord.com/developers/applications), copy its token and put it into the quotation marks of `token`.  

Should you want to give a Discord user owner rights (for example yourself), copy their Discord user ID and put it, with quotation marks, into the `owners` array. Separate mutliple IDs with a comma.  
Example: `"owners": ["123", "456", "789"],`

Save the file and start the bot. 

&nbsp;

## Inviting a Discord Bot
To invite your Discord Bot, copy its ID (you can find it in the General Information tab inside the Developer Dashboard) and paste it into this link (where it says REPLACE_WITH_BOT_ID):  
`https://discord.com/oauth2/authorize?client_id=REPLACE_WITH_BOT_ID&scope=bot&permissions=2214661184`

The 2214661184 permissions allow the bot to read & write messages, add reactions and change its nickname.  

Open the link in your browser and follow the UI to add it to your server.

&nbsp;

## Starting
When starting the bot, you should see the plugin being loaded in the log.  
After a few seconds your Discord Bot will appear online and you are able to execute its slash commands to interact with the Steam Bot.

Try it out by requesting comments for example!

> **Note:** When requesting something for a Steam User (for example comments), you always need to provide an ID (or profile link or profile vanity). You cannot request comments for yourself without providing an ID like you can when requesting from the Steam Chat because the Discord plugin cannot know what your corresponding Steam profile is. I hope this is understandable.
