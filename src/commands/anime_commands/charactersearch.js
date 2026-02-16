const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
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

      characterData.media.nodes.forEach(anime => {
        const animeTitle = anime.title.romaji || `${getLocalizedMessage('global', 'unavailable', interaction.locale)}`;
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
      console.error(getLocalizedMessage('global', 'error'), error);
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
      } else {
        await interaction.reply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
      }
    }
  },
};