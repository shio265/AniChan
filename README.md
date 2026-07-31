# Overview

AniChan is a TypeScript Discord bot for browsing AniList. You can search for anime, manga, get user stats, and more.

## Install

### Requirements

- [Discord.js v14](https://discord.js.org/)
- [Bun](https://bun.sh/) >= 1.3 or other [Javascript/Typescript Runtime](https://github.com/JohnDeved/awesome-typescript-compilers#runtimes)

### Setup

- Clone the repository: `git clone https://github.com/Anichan-Projects/AniChan.git`

- Install dependencies: `bun install`

- Edit the variables in the `.env-example` file then rename the file to `.env`

- Build and start the bot: `bun run build` then `bun run start`, or run directly with `bun ./src/index.ts`

- For debugging: use the command: `bun run debug`

### Docker

- Build and run with Docker Compose: `docker compose up -d --build`

- Per-guild settings (such as the NSFW filter toggle) are persisted in the `anichan-data` volume.

### Features

- Search for and display info about anime, manga, and trending anime from AniList
- Search for the names of anime with the appearance of a certain character
- Show AniList user stats
- Show trending anime
- Get information about anime characters
- Get information about a studio and staff
- Get weather information
- Get user avatar
- Toggle the Ecchi/Hentai content filter per server

And many other features.

## Commands

## Anime Commands

- `/user`: Get AniList user stats.
- `/manga`: Search for manga.
- `/anime`: Search for anime.
- `/charactersearch`: Search for the names of anime with the appearance of a certain character.
- `/characters`: Get information about anime characters.
- `/trending`: Show trending anime.
- `/studio`: Get information about a studio.
- `/staff`: Get basic information about staff.
- `/popular`: Get the list of popular anime.

## Other Commands

- `/help`: Get bot command list.
- `/avatar`: Get user avatar.
- `/weather`: Get weather information.
- `/nsfwfilter`: Enable or disable the Ecchi/Hentai filter for this server (requires Manage Server permission).

## Issues

[Open issue](https://github.com/Anichan-Projects/AniChan/issues) or [join the discord server](https://discord.gg/PE29XWTTc5)

## Attribution

- [AniList](https://anilist.co) & [AniChart](https://anichart.net)
- [GraphQL](https://graphql.org)

## License

AniChan is an open-source project under the [MIT License](https://en.wikipedia.org/wiki/MIT_License) that allows you to modify the code used for:

- [x] Revision
- [x] Allotment
- [x] Personal use

In addition, you must also comply with the [Terms of Service of the AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/overview/overview).
