const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token) {
    console.error('ERROR: BOT_TOKEN not found in .env file! Please check your .env configuration.');
    process.exit(1);
}

if (!clientId) {
    console.error('ERROR: CLIENT_ID not found in .env file! Please check your .env configuration.');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started removing all slash commands...');

        // Delete all global commands
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        console.log('Successfully removed all global slash commands.');
        process.exit(0);

    } catch (error) {
        console.error('Error removing slash commands:', error.message || error);
        process.exit(1);
    }
})();