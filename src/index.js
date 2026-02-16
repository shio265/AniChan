const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { getLocalizedMessage } = require('./utils/localizations.js');

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
const token = process.env.BOT_TOKEN;

const commands = new Collection();
const commandsDirectory = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsDirectory);
for (const folder of commandFolders) {
    const folderPath = path.join(commandsDirectory, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        commands.set(command.data.name, command);
    }
}

client.once('clientReady', async () => {
    console.log(`${client.user.tag} ${getLocalizedMessage('global', 'ready')}`);
    console.log(`${getLocalizedMessage('global', 'waiting_command')}`);
    const commandsArray = commands.map(command => command.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commandsArray });
        console.log(`${getLocalizedMessage('global', 'command_register')}`);
    } catch (error) {
        console.error(`${getLocalizedMessage('global', 'command_register_error')}`, error);
    }
});

(async () => {
    await client.login(token);
})();

require('./status.js');

client.on('guildCreate', async (guild) => {
    try {
        console.log(`${getLocalizedMessage('global', 'guild_join')}: ${guild.name} (ID: ${guild.id}).`);

        const commandsArray = commands.map(command => command.data.toJSON());
        const rest = new REST({ version: '10' }).setToken(token);

        await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: commandsArray });

        console.log(`${getLocalizedMessage('global', 'command_register')}: ${guild.name} (ID: ${guild.id})`);
    } catch (error) {
        console.error(`${getLocalizedMessage('global', 'server_register_error')} ${guild.name} (ID: ${guild.id})`, error);
    }
});

client.on('interactionCreate', async (interaction) => {
    // slash command handle
    if (interaction.isCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply(`${getLocalizedMessage('global', 'command_error', interaction.locale)}`);
            }
        }
    }
    
    // autocomplete handle
    else if (interaction.isAutocomplete()) {
        const command = commands.get(interaction.commandName);
        if (!command || !command.autocomplete) return;

        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error('Error handling autocomplete:', error);
        }
    }
});