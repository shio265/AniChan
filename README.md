# Overview

AniChan is a TypeScript Discord bot for browsing AniList. You can search for anime, light novels, get user stats, and more.

## Install

### Requirements:
- [Discord.js v14](https://www.npmjs.com/package/discord.js/v/14.16.3)
- [Bun](https://bun.sh/) 1.3 or newer

### Install
- Clone the repository: `git clone https://github.com/Anichan-Projects/AniChan.git`

- Install dependencies: `bun install`

- Edit the variables in the `.env-exmaple` file then rename the file to `.env`

- Start the bot with the command: `bun run start` or `bun ./src/index.ts`

- For debugging: use the command: `bun run debug`

### Features

- Search for and display info about anime, light novels, and trending anime from AniList
- Search for the names of anime with the appearance of a certain character
- Show AniList user stats
- Show trending anime
- Get information about anime characters
- Get information about a studio and staff
- Get weather infomation
- Get avtar user
- Anime image source finder

And many other features.

# Commands
## Anime Commands
- `/user`: Get AniList user stats.
- `/search image url`: Search for anime names using links to images.
- `/search image upload`: Search for anime names using upload images.
- `/manga`: Search for manga.
- `/anime`: Search for anime.
- `/character_search`: Search for the names of anime with the appearance of a certain character.
- `/character`: Get information about anime characters.
- `/trending`: Show trending anime.
- `/studio`: Get information about a studio.
- `/staff`: Get basic information about staff.
- `/popular`: Get the list of popular anime.

## Other Commands
- `/help`: Get bot command list.
- `/stats`: Get bot stats.
- `/avatar`: Get user avatar.
- `/ascii`: Convert text to ASCII code.
- `/weather`: Get weather infomation.
- `/switch_language`: Switch bot language. Default is English (EN) (owner only use this command).

# Issues

Open issue [here](https://github.com/Anichan-Projects/AniChan/issues) or [join the discord server](https://discord.gg/PE29XWTTc5)

# Attribution

✨ [AniList](https://anilist.co) & [AniChart](https://anichart.net)

✨ [GraphQL](https://graphql.org)


# License

AniChan is an open-source project under the [MIT License](https://en.wikipedia.org/wiki/MIT_License) that allows you to modify the code used for:

- [x] Revision
- [x] Allotment
- [x] Personal use

In addition, you must also comply with the [Terms of Service of the AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/overview/overview).
