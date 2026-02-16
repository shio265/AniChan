const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
  data: (() => {
    const localization = getCommandLocalization('anime');
    return new SlashCommandBuilder()
        .setName(localization.name)
        .setNameLocalizations(localization.nameLocalizations)
        .setDescription(localization.description)
        .setDescriptionLocalizations(localization.descriptionLocalizations)
        .addStringOption(option => option.setName('name').setDescription(getLocalizedMessage('anime', 'anime_name')).setRequired(true));
  })(),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const animeName = interaction.options.getString('name');
      const queryPath = path.join(__dirname, '../../queries/anime.graphql');
      const variables = { name: animeName };

      const data = await queryAnilistFromFile(queryPath, variables);
      const animeData = data.data.Media;

      if (!animeData) {
        return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)} **${animeName}**`);
      }

      const genres = animeData.genres;
      if (genres.includes('Ecchi') || genres.includes('Hentai')) {
        return interaction.editReply(`**${getLocalizedMessage('global', 'nsfw_block', interaction.locale)} ${animeName}**\n${getLocalizedMessage('global', 'nsfw_block_reason', interaction.locale)}`);
      }

      const description = parseHtmlText(animeData.description, 600);

      const embedImage = "https://img.anili.st/media/" + animeData.id;

      const embed = new EmbedBuilder()
          .setTitle(animeData.title.romaji)
          .setURL(animeData.siteUrl)
          .setDescription(description)
          .setColor('#66FFFF')
          .addFields(
              { name: getLocalizedMessage('global', 'episodes', interaction.locale), value: `${animeData.episodes || getLocalizedMessage('global', 'unavailable', interaction.locale)}`, inline: true },
              { name: getLocalizedMessage('global', 'status', interaction.locale), value: `${animeData.status}`, inline: true },
              { name: getLocalizedMessage('global', 'average_score', interaction.locale), value: `${animeData.averageScore}/100`, inline: true },
              { name: getLocalizedMessage('global', 'mean_score', interaction.locale), value: `${animeData.meanScore}/100`, inline: true },
              { name: getLocalizedMessage('global', 'season', interaction.locale), value: `${animeData.season} - ${animeData.startDate.year}`, inline: true },
              { name: getLocalizedMessage('global', 'studio', interaction.locale), value: `${animeData.studios.edges.map(edge => edge.node.name).join(', ')}`, inline: true }
          )
          .setImage(embedImage)
          .setTimestamp();

      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                  .setURL(animeData.siteUrl)
                  .setStyle(ButtonStyle.Link)
          );

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(getLocalizedMessage('global', 'error'), error);
      const errorMessage = getLocalizedMessage('global', 'error_reply', interaction.locale);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};