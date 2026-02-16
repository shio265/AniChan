const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
  data: (() => {
        const localization = getCommandLocalization('trending');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })(),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const queryPath = path.join(__dirname, '../../queries/trending.graphql');

      const data = await queryAnilistFromFile(queryPath, {});

      const trendingAnime = data.data.Page.media;
      let currentPage = 0;

      const updateEmbed = () => {
        const anime = trendingAnime[currentPage];
        const description = parseHtmlText(anime.description, 250) || getLocalizedMessage('global', 'unavailable', interaction.locale);
        const embedImage = "https://img.anili.st/media/" + anime.id;
        const embed = new EmbedBuilder()
            .setTitle(anime.title.romaji)
            .setURL(anime.siteUrl)
            .setDescription(`__**${getLocalizedMessage('global', 'description', interaction.locale)}:**__ ${description}\n__**${getLocalizedMessage('global', 'average_score', interaction.locale)}:**__ ${anime.averageScore}/100\n__**${getLocalizedMessage('global', 'mean_score', interaction.locale)}:**__ ${anime.meanScore ? anime.meanScore + '/100' : `${getLocalizedMessage('global', 'unavailable', interaction.locale)}`}`)
            .setImage(embedImage)
            .setFooter({ text: `${getLocalizedMessage('global', 'page', interaction.locale)}: ${currentPage + 1}/${trendingAnime.length}` })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel(`${getLocalizedMessage('global', 'preview_button', interaction.locale)}`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel(`${getLocalizedMessage('global', 'next_button', interaction.locale)}`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === trendingAnime.length - 1),
                new ButtonBuilder()
                    .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                    .setURL(anime.siteUrl)
                    .setStyle(ButtonStyle.Link)
            );

        return { embeds: [embed], components: [row] };
      };

      await interaction.editReply(updateEmbed());

      const filter = i => i.customId === 'prev' || i.customId === 'next';
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        if (i.customId === 'prev' && currentPage > 0) {
          currentPage--;
        } else if (i.customId === 'next' && currentPage < trendingAnime.length - 1) {
          currentPage++;
        }
        await i.update(updateEmbed());
      });

      collector.on('end', async () => {
        try {
          await interaction.editReply({ components: [] });
        } catch (error) {
          console.error(getLocalizedMessage('global', 'error'), error);
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