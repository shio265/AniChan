import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';
import { queryAnilistFromFile } from './../../hook/anilist.js';
import { uniqueMediaTitles } from './../../utils/media.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  data: (() => {
        const localization = getCommandLocalization('character_search');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
      .addStringOption(option => option.setName('character').setDescription(getLocalizedMessage('character_search', 'command_description')).setRequired(true)),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const character = interaction.options.getString('character');
      const queryPath = path.join(__dirname, '../../queries/characters.graphql');
      const variables = { search: character };

      const data = await queryAnilistFromFile(queryPath, variables);
      const characterData = data.data.Character;

      if (!characterData) {
        return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)} **${character}**`);
      }

      const embed = new EmbedBuilder()
          .setTitle(`${getLocalizedMessage('character_search', 'anime_list', interaction.locale)} ${characterData.name.full}`)
          .setDescription(`${getLocalizedMessage('character_search', 'anime_list', interaction.locale)} **${characterData.name.full}**:`)
          .setTimestamp();

      const animeTitles = uniqueMediaTitles(
        characterData.media.nodes,
        getLocalizedMessage('global', 'unavailable', interaction.locale),
      );

      animeTitles.forEach(animeTitle => {
        embed.addFields({ name: animeTitle, value: '\u200B', inline: false });
      });

      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                  .setURL(characterData.siteUrl)
                  .setStyle(ButtonStyle.Link)
          );

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      await handleInteractionError(error, interaction);
    }
  },
};
