import { ActivityType, Status, type Client } from 'discord.js';
import { getLocalizedMessage } from './utils/localizations.js';

const activities = [
  { type: ActivityType.Watching, text: 'anime' },
  { type: ActivityType.Watching, text: 'anilist.co' },
  { type: ActivityType.Custom, text: 'manga' },
];

const initializedClients = new WeakSet<Client>();

function setRandomActivity(client: Client) {
  if (!client.user || client.ws.status !== Status.Ready) return;

  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  client.user.setActivity(randomActivity.text, { type: randomActivity.type });
}

export function setupStatus(client: Client): void {
  if (initializedClients.has(client)) return;
  initializedClients.add(client);

  client.once('clientReady', () => {
    console.log(`${getLocalizedMessage('global', 'status_ready')}`);

    setRandomActivity(client);
    setInterval(() => {
      setRandomActivity(client);
    }, 10 * 60 * 1000);
  });
}
