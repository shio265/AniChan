const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { getLocalizedMessage } = require('./utils/localizations.js');

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('ERROR: BOT_TOKEN not found in .env file! Please check your .env configuration.');
    process.exit(1);
}

const activities = [
  { type: ActivityType.Watching, text: 'anime' },
  { type: ActivityType.Watching, text: 'anilist.co' },
  { type: ActivityType.Custom, text: 'manga' },
];

function setRandomActivity() {
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  client.user.setActivity(randomActivity.text, { type: randomActivity.type });
}

client.once('clientReady', () => {
  console.log(`${getLocalizedMessage('global', 'status_ready')}`);

  setRandomActivity();
  setInterval(() => {
    setRandomActivity();
  }, 10 * 60 * 1000);
});

client.login(token).catch(error => {
    console.error('Failed to set bot status:', error.message);
    process.exit(1);
});