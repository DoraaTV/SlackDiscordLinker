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
*/

app.event('message', async ({ event, client }) => {
  const username = await client.users.info({token : config.slacktoken, user: event.user});
  const avatar = await client.users.profile.get({token : config.slacktoken, user: event.user});

  if (username.ok === false) return;
  if (event.channel !== config.slackChannelGeneral) return;
  if (event.subtype === "channel_join" || event.subtype === "channel_join") return;
  if (event.subtype === "message_changed" || event.subtype === "message_deleted") return;
  if (event.subtype === "bot_message") return;

  const payload = {
      content: event.text,
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
*/


bot.on('messageCreate', async message => {

  if (message.channel.id === config.discordChannelGeneral) {
      if (message.author.bot) return;
      const payload = {
          channel: config.slackChannelGeneral,
          username: message.member.displayName,
          icon_url: message.author.displayAvatarURL(),
          text: message.content
      };

      try {
          const r = await fetch("https://slack.com/api/chat.postMessage", {
              method: "POST",
              body: JSON.stringify(payload),
              headers: {
                  "Content-Type": "application/json; charset=utf-8",
                  "Content-Length": payload.length,
                  Authorization: `Bearer ${config.slacktoken}`,
                  Accept: "application/json",
              },
          })
          if (!r.ok) {
              throw new Error(`Server error ${res.status}`);
          }
          return r.json()
      }
      catch(e) {
          console.error(e)
      }
  }
})
