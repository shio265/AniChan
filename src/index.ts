import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
import { setupStatus } from './status.js';
import { loadCommands, setupCommandHandlers } from './handlers/commandhandler.js';

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
const token = process.env.BOT_TOKEN;

if (!token) {
    console.error('ERROR: BOT_TOKEN not set. Please check your configuration.');
    process.exit(1);
}

setupStatus(client);
setupCommandHandlers(client, token);

let isStarting = false;
let isShuttingDown = false;

async function shutdown(exitCode: number, reason?: unknown): Promise<void> {
    if (isShuttingDown) return;
    isShuttingDown = true;

    if (reason) {
        console.error(reason);
    }

    try {
        client.removeAllListeners();
        client.destroy();
    } finally {
        process.exit(exitCode);
    }
}

process.once('SIGINT', () => {
    void shutdown(0, 'Received SIGINT, shutting down.');
});

process.once('SIGTERM', () => {
    void shutdown(0, 'Received SIGTERM, shutting down.');
});

process.once('uncaughtException', error => {
    void shutdown(1, error);
});

process.once('unhandledRejection', reason => {
    void shutdown(1, reason);
});

async function start(): Promise<void> {
    if (isStarting) return;
    isStarting = true;

    try {
        await loadCommands();
        await client.login(token);
    } catch (error) {
        const message = error instanceof Error ? error.message : error;
        console.error('Failed to start bot:', message);
        await shutdown(1);
    }
}

void start();
