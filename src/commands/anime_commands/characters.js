const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
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

      const uniqueAnimeAppearances = [...new Set(characterData.media.nodes.map(node => node.title.romaji))];

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
      console.error(getLocalizedMessage('global', 'error'), error);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
      } else {
        await interaction.reply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
      }
    }
  },
};