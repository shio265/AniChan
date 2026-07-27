import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';
import { queryAnilistFromFile } from './../../hook/anilist.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  data: (() => {
        const localization = getCommandLocalization('user');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
      .addStringOption(option => option.setName('username').setDescription(getLocalizedMessage('user', 'user_name')).setRequired(true)),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const username = interaction.options.getString('username');
      const queryPath = path.join(__dirname, '../../queries/user.graphql');

      const data = await queryAnilistFromFile(queryPath, { username });
      const userData = data.data.User;

      if (!userData) {
        return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)}: **${username}**`);
      }

      const userImage = `https://img.anili.st/user/${userData.id}`;

      const embed = new EmbedBuilder()
          .setTitle(`${userData.name}'s infomation`)
          .setURL(userData.siteUrl)
          .setColor('#C6FFFF')
          .addFields(
              {
                name: `${getLocalizedMessage('user', 'anime_count', interaction.locale)}`,
                value: `${userData.statistics.anime.count} ${getLocalizedMessage('user', 'anime_count_value', interaction.locale)}.`,
                inline: true,
              },
              {
                name: `${getLocalizedMessage('user', 'minutes_watched', interaction.locale)}`,
                value: `${userData.statistics.anime.minutesWatched} ${getLocalizedMessage('user', 'minutes_watched_value', interaction.locale)}`,
                inline: true,
              },
              {
                name: `${getLocalizedMessage('user', 'manga_count', interaction.locale)}`,
                value: `${userData.statistics.manga.count} ${getLocalizedMessage('user', 'manga_count_value', interaction.locale)}.`,
                inline: true,
              },
              {
                name: `${getLocalizedMessage('user', 'chapters_read', interaction.locale)}`,
                value: `${userData.statistics.manga.chaptersRead} ${getLocalizedMessage('user', 'chapters_read_value', interaction.locale)}.`,
                inline: true,
              }
          )
          .setImage(userImage)
          .setTimestamp();

      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                  .setURL(userData.siteUrl)
                  .setStyle(ButtonStyle.Link)
          );

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      await handleInteractionError(error, interaction);
    }
  },
};
