# SlackDiscordLinker
A simple slack/discord channels linker

Use :
```
npm init -y
npm install (all prerequisite)
```

Prerequisite :
- @slack/bolt
- discord.js
- dotenv
- node-fetch

Installing :
- Simply create a discord bot on the discord developper page, and a slack app with there required scopes:
  * [app_mention:read](https://api.slack.com/scopes/app_mentions:read)
  * [channels:history](https://api.slack.com/scopes/channels:history)
  * [channels:join](https://api.slack.com/scopes/channels:join)
  * [channels:read](https://api.slack.com/scopes/channels:read)
  * [chat:write](https://api.slack.com/scopes/chat:write)
  * [chat:write.customize](https://api.slack.com/scopes/chat:write.customize)
  * [chat:write.public](https://api.slack.com/scopes/chat:write.public)
  * [groups:history](https://api.slack.com/scopes/groups:history)
  * [im:history](https://api.slack.com/scopes/im:history)
  * [incoming-webhook](https://api.slack.com/scopes/incoming-webhook)
  * [mpim:history](https://api.slack.com/scopes/mpim:history)
  * [users.profile:read](https://api.slack.com/scopes/users.profile:read)
  * [users:read](https://api.slack.com/scopes/users:read)
  
- And these User Token Scopes
  * [channels:history](https://api.slack.com/scopes/channels:history)
  * [chat:write](https://api.slack.com/scopes/chat:write)
  * [users.profile:read](https://api.slack.com/scopes/users.profile:read)
 
- Also you must subscribe to the event [message.channels](https://api.slack.com/events/message.channels) on behalf of users

- Don't forget to create a file named config.js and replace all data to your own data, tokens, channels id, etc

- When all done, use :
> node main.js
