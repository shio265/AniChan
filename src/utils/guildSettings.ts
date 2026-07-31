import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveSettingsPath(): string {
    const bundledPath = path.join(__dirname, '../../data/guild_settings.json');
    if (existsSync(path.dirname(bundledPath))) {
        return bundledPath;
    }
    return path.join(process.cwd(), 'data', 'guild_settings.json');
}

const settingsPath = resolveSettingsPath();

type GuildSettings = {
    nsfwFilterEnabled: Record<string, boolean>;
};

const defaultSettings: GuildSettings = {
    nsfwFilterEnabled: {}
};

function loadSettings(): GuildSettings {
    try {
        const raw = readFileSync(settingsPath, 'utf8');
        return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
        return { ...defaultSettings };
    }
}

function saveSettings(settings: GuildSettings): void {
    mkdirSync(path.dirname(settingsPath), { recursive: true });
    writeFileSync(settingsPath, JSON.stringify(settings, null, 4), 'utf8');
}

export function isNSFWFilterEnabled(guildId: string): boolean {
    const settings = loadSettings();
    return settings.nsfwFilterEnabled[guildId] ?? true;
}

export function setNSFWFilterEnabled(guildId: string, enabled: boolean): void {
    const settings = loadSettings();
    settings.nsfwFilterEnabled[guildId] = enabled;
    saveSettings(settings);
}
