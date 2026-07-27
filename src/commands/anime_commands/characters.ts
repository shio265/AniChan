import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';
import { queryAnilistFromFile } from './../../hook/anilist.js';
import { uniqueMediaTitles } from './../../utils/media.js';
import { parseHtmlText } from './../../utils/textParser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  data: (() => {
        const localization = getCommandLocalization('characters');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
      .addStringOption(option => option.setName('name').setDescription(getLocalizedMessage('character', 'character_name')).setRequired(true)),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const characterName = interaction.options.getString('name');
      const queryPath = path.join(__dirname, '../../queries/characters.graphql');
      const variables = { search: characterName };

      const data = await queryAnilistFromFile(queryPath, variables);
      const characterData = data.data.Character;

      if (!characterData) {
        return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)} **${characterName}**`);
      }

      const description = parseHtmlText(characterData.description, 600) || getLocalizedMessage('global', 'no_description', interaction.locale);

      const uniqueAnimeAppearances = uniqueMediaTitles(
        characterData.media.nodes,
        getLocalizedMessage('global', 'unavailable', interaction.locale),
      );

      const embed = new EmbedBuilder()
          .setTitle(characterData.name.full)
          .setURL(characterData.siteUrl)
          .setDescription(description)
          .addFields({ name: `${getLocalizedMessage('character', 'anime_appearances', interaction.locale)}`, value: uniqueAnimeAppearances.join(', ') || `${getLocalizedMessage('global', 'no_results', interaction.locale)}` })
          .setImage(characterData.image.large)
          .setColor('#C6FFFF')
          .setTimestamp();

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
