const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
    data: (() => {
        const localization = getCommandLocalization('schedule');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })(),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const queryPath = path.join(__dirname, '../../queries/schedule.graphql');
            let currentPage = 1;
            const perPage = 10;
            const airingAtGreater = Math.floor(Date.now() / 1000);

            const fetchPage = async (page) => {
                const variables = { page, perPage, airingAtGreater };
                const data = await queryAnilistFromFile(queryPath, variables);
                return data.data.Page;
            };

            let pageData = await fetchPage(currentPage);

            if (!pageData.airingSchedules.length) {
                return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)}`);
            }

            const updateEmbed = () => {
                const scheduleList = pageData.airingSchedules.map(item => {
                    const airDate = new Date(item.airingAt * 1000).toLocaleString();
                    return `**${item.media.title.romaji}** - Episode ${item.episode} - Airing at: ${airDate} - [Link](${item.media.siteUrl})`;
                }).join('\n');

                const embed = new EmbedBuilder()
                    .setTitle(`${getLocalizedMessage('schedule', 'airing_schedule', interaction.locale)}`)
                    .setDescription(scheduleList)
                    .setFooter({ text: `${getLocalizedMessage('global', 'page', interaction.locale)}: ${currentPage}` })
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel(`${getLocalizedMessage('global', 'preview_button', interaction.locale)}`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 1),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel(`${getLocalizedMessage('global', 'next_button', interaction.locale)}`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(!pageData.pageInfo.hasNextPage)
                    );

                return { embeds: [embed], components: [row] };
            };

            await interaction.editReply(updateEmbed());

            const filter = i => i.customId === 'prev' || i.customId === 'next';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 200000 });

            collector.on('collect', async i => {
                if (i.customId === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (i.customId === 'next' && pageData.pageInfo.hasNextPage) {
                    currentPage++;
                }
                pageData = await fetchPage(currentPage);
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