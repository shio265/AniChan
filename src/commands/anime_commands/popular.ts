import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';
import { queryAnilistFromFile } from './../../hook/anilist.js';
import { parseHtmlText } from './../../utils/textParser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    data: (() => {
        const localization = getCommandLocalization('popular');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })(),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const queryPath = path.join(__dirname, '../../queries/popular.graphql');

            const data = await queryAnilistFromFile(queryPath, {});

            const popularAnime = data.data.Page.media;
            let currentPage = 0;
            const sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            const prevId = `${sessionId}_prev`;
            const nextId = `${sessionId}_next`;

            const updateEmbed = () => {
                const anime = popularAnime[currentPage];
                const description = parseHtmlText(anime.description, 250) || getLocalizedMessage('global', 'unavailable', interaction.locale);
                const embedImage = "https://img.anili.st/media/" + anime.id;
                const embed = new EmbedBuilder()
                    .setTitle(anime.title.romaji)
                    .setURL(anime.siteUrl)
                    .setDescription(`__**${getLocalizedMessage('global', 'description', interaction.locale)}:**__ ${description}\n__**${getLocalizedMessage('global', 'average_score', interaction.locale)}:**__ ${anime.averageScore}/100\n__**${getLocalizedMessage('global', 'mean_score', interaction.locale)}:**__ ${anime.meanScore ? anime.meanScore + '/100' : `${getLocalizedMessage('global', 'unavailable', interaction.locale)}`}`)
                    .setImage(embedImage)
                    .setFooter({ text: `${getLocalizedMessage('global', 'page', interaction.locale)}: ${currentPage + 1}/${popularAnime.length}` })
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
                            .setDisabled(currentPage === popularAnime.length - 1),
                        new ButtonBuilder()
                            .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                            .setURL(anime.siteUrl)
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
                } else if (i.customId === nextId && currentPage < popularAnime.length - 1) {
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
