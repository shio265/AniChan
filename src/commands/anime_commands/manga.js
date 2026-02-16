const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
    data: (() => {
        const localization = getCommandLocalization('manga');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
        .addStringOption(option => option.setName('name').setDescription(getLocalizedMessage('manga', 'manga_name')).setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const mangaName = interaction.options.getString('name');
            const queryPath = path.join(__dirname, '../../queries/manga.graphql');
            const variables = { name: mangaName };

            const data = await queryAnilistFromFile(queryPath, variables);
            const mangaData = data.data.Media;

            if (!mangaData) {
                return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)} **${mangaName}**`);
            }

            const mangaGenre = mangaData.genres;
            if (mangaGenre.includes('Ecchi') || mangaGenre.includes('Hentai')) {
                return interaction.editReply(`**${getLocalizedMessage('global', 'nsfw_block', interaction.locale)} ${mangaName}**\n${getLocalizedMessage('global', 'nsfw_block_reason', interaction.locale)}`);
            }

            const description = parseHtmlText(mangaData.description, 500) || getLocalizedMessage('global', 'no_description', interaction.locale);

            const embedImage = "https://img.anili.st/media/" + mangaData.id;
            const embed = new EmbedBuilder()
                .setTitle(mangaData.title.romaji)
                .setURL(mangaData.siteUrl)
                .setDescription(description)
                .addFields(
                    {
                        name: `${getLocalizedMessage('global', 'chapters', interaction.locale)}`,
                        value: mangaData.chapters ? mangaData.chapters : `${getLocalizedMessage('global', 'unavailable', interaction.locale)}`,
                        inline: true
                    },
                    {
                        name: `${getLocalizedMessage('global', 'genres', interaction.locale)}`,
                        value: mangaData.genres.join(', '),
                        inline: true
                    },
                    {
                        name: `${getLocalizedMessage('global', 'average_score', interaction.locale)}`,
                        value: `${mangaData.averageScore}/100`,
                        inline: true
                    },
                    {
                        name: `${getLocalizedMessage('global', 'mean_score', interaction.locale)}`,
                        value: `${mangaData.meanScore ? mangaData.meanScore + '/100' : `${getLocalizedMessage('global', 'unavailable', interaction.locale)}`}`,
                        inline: true
                    },
                )
                .setImage(embedImage)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                        .setURL(mangaData.siteUrl)
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