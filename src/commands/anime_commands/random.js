const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

// Helper function to fetch random anime
async function fetchRandomAnime() {
  let randomAnime;
  let attempts = 0;
  const maxAttempts = 10;
  let maxPages = null;
  
  // Retry mechanism to get valid, non-NSFW content
  while (attempts < maxAttempts && !randomAnime) {
    try {
      // Add random sorting
      const sortOptions = ['POPULARITY_DESC', 'SCORE_DESC', 'TRENDING_DESC', 'FAVOURITES_DESC'];
      const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
      
      // First request: get pageInfo if not cached
      if (maxPages === null) {
        const queryPath = path.join(__dirname, '../../queries/random.graphql');
        const infoData = await queryAnilistFromFile(queryPath, { page: 1, sort: randomSort, perPage: 1 }, { timeout: 10000 });
        
        maxPages = Math.min(infoData.data.Page.pageInfo.lastPage, 500);
      }
      
      // Generate random page within actual limits
      const randomPage = Math.floor(Math.random() * maxPages) + 1;
                
      const variables = { 
        page: randomPage,
        sort: randomSort,
        perPage: 25
      };

      const queryPath = path.join(__dirname, '../../queries/random.graphql');
      const data = await queryAnilistFromFile(queryPath, variables, { timeout: 10000 });

      const animeList = data.data.Page.media;

      if (animeList && animeList.length > 0) {
        // Filter out NSFW content before random selection
        const restrictedGenres = ["Ecchi", "Hentai"];
        const safeAnimeList = animeList.filter(anime => 
          !anime.genres.some(genre => restrictedGenres.includes(genre))
        );
        
        if (safeAnimeList.length > 0) {
          // Use crypto.getRandomValues for better randomness if available
          let randomIndex;
          if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            randomIndex = array[0] % safeAnimeList.length;
          } else {
            randomIndex = Math.floor(Math.random() * safeAnimeList.length);
          }
          
          randomAnime = safeAnimeList[randomIndex];
          break;
        }
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch {
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  return randomAnime;
}

// Helper function to create embed and buttons
function createAnimeEmbed(randomAnime, locale) {
  // Double-check NSFW filtering (extra safety)
  const restrictedGenres = ["Ecchi", "Hentai"];
  if (randomAnime.genres.some(genre => restrictedGenres.includes(genre))) {
    return null;
  }

  const description = parseHtmlText(randomAnime.description, 600);

  // AniList image format
  const embedImage = `https://img.anili.st/media/${randomAnime.id}`;

  const embed = new EmbedBuilder()
    .setTitle(randomAnime.title.romaji)
    .setURL(randomAnime.siteUrl)
    .setDescription(description)
    .setColor("#66FFFF")
    .addFields(
      {
        name: `${getLocalizedMessage('global', 'episodes', locale)}`,
        value: `${randomAnime.episodes || getLocalizedMessage('global', 'unavailable', locale)}`,
        inline: true,
      },
      {
        name: `${getLocalizedMessage('global', 'status', locale)}`,
        value: `${randomAnime.status}`,
        inline: true,
      },
      {
        name: `${getLocalizedMessage('global', 'average_score', locale)}`,
        value: `${randomAnime.averageScore ? randomAnime.averageScore : getLocalizedMessage('global', 'unavailable', locale)}/100`,
        inline: true,
      },
      {
        name: `${getLocalizedMessage('global', 'mean_score', locale)}`,
        value: `${randomAnime.meanScore ? randomAnime.meanScore : getLocalizedMessage('global', 'unavailable', locale)}/100`,
        inline: true,
      },
      {
        name: `${getLocalizedMessage('global', 'season', locale)}`,
        value: `${randomAnime.season || getLocalizedMessage('global', 'unavailable', locale)}${randomAnime.startDate && randomAnime.startDate.year ? ` - ${randomAnime.startDate.year}` : ''}`,
        inline: true,
      },
      {
        name: `${getLocalizedMessage('global', 'studio', locale)}`,
        value: `${randomAnime.studios.edges.map(edge => edge.node.name).join(", ") || getLocalizedMessage('global', 'unavailable', locale)}`,
        inline: true,
      }
    )
    .setImage(embedImage)
    .setTimestamp();

  // Create action row with buttons
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('random_again')
        .setLabel(getLocalizedMessage('global', 'random_again', locale))
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🎲'),
      new ButtonBuilder()
        .setLabel(getLocalizedMessage('global', 'view_anilist', locale))
        .setURL(randomAnime.siteUrl)
        .setStyle(ButtonStyle.Link)
    );

  return { embed, row, anime: randomAnime };
}

module.exports = {
  data: (() => {
        const localization = getCommandLocalization('random');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })(),

  async execute(interaction) {
    try {
      await interaction.deferReply();
      
      // Fetch random anime
      const randomAnime = await fetchRandomAnime();
      
      // If no anime found after all attempts
      if (!randomAnime) {
        return interaction.editReply(getLocalizedMessage('global', 'no_results', interaction.locale));
      }

      // Create embed and buttons
      const result = createAnimeEmbed(randomAnime, interaction.locale);
      
      if (!result) {
        return interaction.editReply(
          `**${getLocalizedMessage('global', 'nsfw_block', interaction.locale)} ${randomAnime.title.romaji}**\n${getLocalizedMessage('global', 'nsfw_block_reason', interaction.locale)}`
        );
      }

      const message = await interaction.editReply({ embeds: [result.embed], components: [result.row] });

      // Create collector for button interactions
      const collector = message.createMessageComponentCollector({ time: 300000 }); // 5 minutes

      collector.on('collect', async i => {
        if (i.customId === 'random_again') {
          try {
            await i.deferUpdate();
            
            // Fetch new random anime
            const newAnime = await fetchRandomAnime();
            
            if (!newAnime) {
              await i.editReply({ 
                content: getLocalizedMessage('global', 'no_results', i.locale),
                embeds: [],
                components: []
              });
              return;
            }

            // Create new embed and buttons
            const newResult = createAnimeEmbed(newAnime, i.locale);
            
            if (!newResult) {
              await i.editReply({
                content: `**${getLocalizedMessage('global', 'nsfw_block', i.locale)} ${newAnime.title.romaji}**\n${getLocalizedMessage('global', 'nsfw_block_reason', i.locale)}`,
                embeds: [],
                components: []
              });
              return;
            }

            await i.editReply({ embeds: [newResult.embed], components: [newResult.row] });
          } catch {
            // Error handling for button interaction
          }
        }
      });

      collector.on('end', async () => {
        try {
          // Disable buttons after collector expires
          const disabledRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('random_again_disabled')
                .setLabel(getLocalizedMessage('global', 'random_again', interaction.locale))
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🎲')
                .setDisabled(true),
              new ButtonBuilder()
                .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                .setURL(result.anime.siteUrl)
                .setStyle(ButtonStyle.Link)
            );
          await interaction.editReply({ components: [disabledRow] });
        } catch {
          // Message might be deleted, ignore error
        }
      });

    } catch (error) {
      console.error(getLocalizedMessage('global', 'error'), error);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
      } else {
        await interaction.reply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
      }
    }
  },
};
