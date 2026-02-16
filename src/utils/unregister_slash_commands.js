const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started removing all slash commands.');

        // Delete all global commands
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        console.log('Successfully removed all global slash commands.');

    } catch (error) {
        console.error('Error removing slash commands:', error);
    }
})();