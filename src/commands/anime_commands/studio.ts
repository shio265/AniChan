import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';
import { queryAnilistFromFile } from './../../hook/anilist.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    data: (() => {
        const localization = getCommandLocalization('studio');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
        .addStringOption(option => option.setName('name').setDescription(getLocalizedMessage('studio', 'studio_name')).setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const studioName = interaction.options.getString('name');
            const queryPath = path.join(__dirname, '../../queries/studio.graphql');
            const variables = { search: studioName };

            const data = await queryAnilistFromFile(queryPath, variables);
            const studioData = data.data.Studio;

            if (!studioData) {
                return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)} **${studioName}**`);
            }

            const animeList = studioData.media.nodes.map((anime, index) => {
                const animeTitle = anime.title.romaji;
                const animeUrl = anime.siteUrl;
                const animeYear = anime.startDate ? anime.startDate.year : `${getLocalizedMessage('global', 'unavailable', interaction.locale)}`;
                return `${index + 1}. [${animeTitle}](${animeUrl}) - ${getLocalizedMessage('studio', 'product_year', interaction.locale)}: ${animeYear}`;
            }).join('\n');

            const pageSize = 10;
            const totalPages = Math.ceil(studioData.media.nodes.length / pageSize);
            let currentPage = 0;
            const sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            const prevId = `${sessionId}_prev`;
            const nextId = `${sessionId}_next`;

            const updateEmbed = () => {
                const startIdx = currentPage * pageSize;
                const endIdx = startIdx + pageSize;
                const displayedAnime = animeList.split('\n').slice(startIdx, endIdx).join('\n');

                const embed = new EmbedBuilder()
                    .setTitle(`${getLocalizedMessage('studio', 'studio_info', interaction.locale)} ${studioData.name}`)
                    .setURL(studioData.siteUrl)
                    .setDescription(`${getLocalizedMessage('studio', 'product_list', interaction.locale)} ${studioData.name}:\n${displayedAnime}`)
                    .setFooter({ text: `${getLocalizedMessage('global', 'page', interaction.locale)}: ${currentPage + 1}/${totalPages}` })
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(prevId)
                            .setLabel(`${getLocalizedMessage('global', 'preview_button', interaction.locale)}`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId(nextId)
                            .setLabel(`${getLocalizedMessage('global', 'next_button', interaction.locale)}`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === totalPages - 1),
                        new ButtonBuilder()
                            .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                            .setURL(studioData.siteUrl)
                            .setStyle(ButtonStyle.Link)
                    );

                return { embeds: [embed], components: [row] };
            };

            await interaction.editReply(updateEmbed());

            const filter = i => i.customId === prevId || i.customId === nextId;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === prevId && currentPage > 0) {
                    currentPage--;
                } else if (i.customId === nextId && currentPage < totalPages - 1) {
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
            await handleInteractionError(error, interaction);
        }
    },
};
