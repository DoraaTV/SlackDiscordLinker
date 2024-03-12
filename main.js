import discord from 'discord.js';
const intents = new discord.IntentsBitField(3276799);
const bot = new discord.Client({intents});
import { config } from './config.js';
import pkg from '@slack/bolt';
const { App } = pkg;
import fetch from "node-fetch";
import dotenv from 'dotenv';

dotenv.config();

/*
*  Initialisation de l'application Slack

*  Slack app initialization
*/

const app = new App({
    token: config.slacktoken,
    signingSecret: config.slacksigning,
    socketMode:true,
    appToken: config.app_token
  });

(async () => {
    const port = 3000
    await app.start(process.env.PORT || port);
    console.log('Bolt app started!!');
})();

/*
*  Initialisation du bot Discord

*  Discord bot initialization
*/

bot.commands = new discord.Collection();
bot.login(config.token);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity('messages', {type: 'listening'});
})

/*
*  Event Listener de Slack, permet de lire les messages recu d'un salon specifique et de renvoyer sur Discord
*  le message recu avec le nom et l'avatar de l'utilisateur Slack

*  Slack event listener, allows to read messages from a specific channel and send them to Discord
*  the received message with the name and avatar of the Slack user
*/

app.event('message', async ({ event, client }) => {
  if (event.subtype === "bot_message" || event.subtype === "message_changed") return;
  const username = await client.users.info({token : config.slacktoken, user: event.user});
  const avatar = await client.users.profile.get({token : config.slacktoken, user: event.user});

  if (username.ok === false) return;
  if (event.channel !== config.slackChannelGeneral) return;
  if (event.subtype === "channel_join" || event.subtype === "channel_join") return;
  if (event.subtype === "message_changed" || event.subtype === "message_deleted") return;
  if (event.subtype === "bot_message") return;

  let attachments = "";
  if (event.files) {
    for (let i = 0; i < event.files.length; i++) {
      attachments += "\n" + event.files[i].url_private;
    }
  }
  const payload = {
      content: (event.text ? event.text : "Files : ") + (attachments ? attachments : ""),
      avatar_url: avatar.profile.image_192,
      username: username.user.profile.display_name_normalized,
  }
  await fetch(config.webHookDiscord, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
          'Content-Type': 'application/json'
      }
  })
});

/* 
*  Event Listener de Discord, permet de lire les messages recu d'un salon specifique et de renvoyer sur Slack
*  le message recu avec le nom et l'avatar de l'utilisateur Discord

*  Discord event listener, allows to read messages from a specific channel and send them to Slack
*  the received message with the name and avatar of the Discord user
*/

bot.on('messageCreate', async message => {

  if (message.channel.id === config.discordChannelGeneral || message.channel.parentId === config.discordChannelGeneral) {
      if (message.author.bot) return;
      let attachments = "";
      if (message.attachments.size > 0) {
        let i = 0;
        for (let attachment of message.attachments.values()) {
          i++;
          attachments += "\n<" + attachment.url + `| File ${i} link>`;
        }
      }

      const payload = {
          channel: config.slackChannelGeneral,
          username: message.member.displayName,
          icon_url: message.author.displayAvatarURL(),
          text: (message.content ? message.content : " ") + (attachments ? attachments : ""),
      };
      
      try {
          const result = await app.client.chat.postMessage({
              token: config.slacktoken,
              channel: payload.channel,
              username: payload.username,
              icon_url: payload.icon_url,
              text: payload.text
          });
      } catch (error) {
          console.error(error);
      }
  }
})
