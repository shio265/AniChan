import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Collection, type Client } from 'discord.js';
import anime from '../commands/anime_commands/anime.js';
import characters from '../commands/anime_commands/characters.js';
import charactersearch from '../commands/anime_commands/charactersearch.js';
import manga from '../commands/anime_commands/manga.js';
import popular from '../commands/anime_commands/popular.js';
import staff from '../commands/anime_commands/staff.js';
import studio from '../commands/anime_commands/studio.js';
import trending from '../commands/anime_commands/trending.js';
import user from '../commands/anime_commands/user.js';
import avatar from '../commands/others/avatar.js';
import help from '../commands/others/help.js';
import nsfwfilter from '../commands/others/nsfwfilter.js';
import weather from '../commands/others/weather.js';
import { getLocalizedMessage } from '../utils/localizations.js';
import { handleInteractionError } from './errorHandler.js';

export type BotCommand = {
    data: {
        name: string;
        toJSON(): unknown;
    };
    execute(interaction): Promise<unknown>;
    autocomplete?(interaction): Promise<unknown>;
};

const commandModules: BotCommand[] = [
    anime,
    characters,
    charactersearch,
    manga,
    popular,
    staff,
    studio,
    trending,
    user,
    avatar,
    help,
    nsfwfilter,
    weather,
];

export const commands = new Collection<string, BotCommand>();

const initializedClients = new WeakSet<Client>();

export async function loadCommands(): Promise<void> {
    commands.clear();

    for (const command of commandModules) {
        if (!command?.data?.name || typeof command.execute !== 'function') {
            console.warn('Warning: Invalid command module structure');
            continue;
        }

        commands.set(command.data.name, command);
    }
}

function getCommandPayload(): unknown[] {
    return commands.map(command => command.data.toJSON());
}

export function setupCommandHandlers(client: Client, token: string): void {
    if (initializedClients.has(client)) return;
    initializedClients.add(client);

    client.once('clientReady', async () => {
        if (!client.user) return;

        console.log(`${client.user.tag} ${getLocalizedMessage('global', 'ready')}`);
        console.log(`${getLocalizedMessage('global', 'waiting_command')}`);

        const rest = new REST({ version: '10' }).setToken(token);
        try {
            await rest.put(Routes.applicationCommands(client.user.id), { body: getCommandPayload() });
            console.log(`${getLocalizedMessage('global', 'command_register')}`);
        } catch (error) {
            console.error(`${getLocalizedMessage('global', 'command_register_error')}`, error);
        }
    });

    client.on('guildCreate', async (guild) => {
        try {
            if (!guild || !guild.id) {
                console.error('Invalid guild object received in guildCreate event');
                return;
            }

            console.log(`${getLocalizedMessage('global', 'guild_join')}: ${guild.name} (ID: ${guild.id}).`);
            if (!client.user) return;

            const rest = new REST({ version: '10' }).setToken(token);
            await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: getCommandPayload() });

            console.log(`${getLocalizedMessage('global', 'command_register')}: ${guild.name} (ID: ${guild.id})`);
        } catch (error) {
            console.error(`${getLocalizedMessage('global', 'server_register_error')} ${guild.name} (ID: ${guild.id})`, error);
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                await handleInteractionError(error, interaction, 'command_error');
            }
            return;
        }

        if (interaction.isAutocomplete()) {
            const command = commands.get(interaction.commandName);
            if (!command?.autocomplete) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error('Error handling autocomplete:', error);
            }
        }
    });
}
