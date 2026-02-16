const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');
const commandCooldown = new Map();

module.exports = {
    cooldown: 60,
    data: (() => {
        const localization = getCommandLocalization('search');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
        .addSubcommandGroup(group =>
            group.setName('image')
                .setDescription(getLocalizedMessage('search', 'image_option'))
                .addSubcommand(subcommand =>
                    subcommand.setName('url')
                        .setDescription(getLocalizedMessage('search', 'image_link'))
                        .addStringOption(option =>
                            option.setName('url')
                                .setDescription(getLocalizedMessage('search', 'image_link'))
                                .setRequired(true))
                        .addBooleanOption(option =>
                            option.setName('cut_black_borders')
                                .setDescription(getLocalizedMessage('search', 'cut_black_borders'))
                                .setRequired(true)))
                .addSubcommand(subcommand =>
                    subcommand.setName('upload')
                        .setDescription(getLocalizedMessage('search', 'upload_image'))
                        .addAttachmentOption(option =>
                            option.setName('upload')
                                .setDescription(getLocalizedMessage('search', 'upload_image'))
                                .setRequired(true))
                        .addBooleanOption(option =>
                            option.setName('cut_black_borders')
                                .setDescription(getLocalizedMessage('search', 'cut_black_borders'))
                                .setRequired(true)))),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const subcommand = interaction.options.getSubcommand();
            const cutBorders = interaction.options.getBoolean('cut_black_borders');
            let imageUrl;

            if (subcommand === 'url') {
                imageUrl = interaction.options.getString('url');
            } else if (subcommand === 'upload') {
                const uploadedImage = interaction.options.getAttachment('upload');
                imageUrl = uploadedImage.url;
            }

            if (commandCooldown.has(interaction.user.id)) {
                const lastUsage = commandCooldown.get(interaction.user.id);
                const currentTime = Date.now();
                const cooldownTime = 60 * 60 * 1000;

                if (currentTime - lastUsage < cooldownTime) {
                    const remainingTime = cooldownTime - (currentTime - lastUsage);
                    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
                    return interaction.editReply(`${getLocalizedMessage('global', 'tracemoe_api_limit', interaction.locale)} ${getLocalizedMessage('global', 'retry', interaction.locale)} ${remainingMinutes} ${getLocalizedMessage('global', 'minute', interaction.locale)}.`);
                }
            }

            let apiUrl = 'https://api.trace.moe/search?url=' + encodeURIComponent(imageUrl);
            if (cutBorders) {
                apiUrl = 'https://api.trace.moe/search?cutBorders&url=' + encodeURIComponent(imageUrl);
            }

            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data.result && data.result.length > 0) {
                const animeid = data.result[0].anilist;

                const queryPath = path.join(__dirname, '../../queries/search.graphql');
                const variables = { id: animeid };
                const graphqlData = await queryAnilistFromFile(queryPath, variables);

                const media = graphqlData.data.Media;
                const animename = media.title.english || media.title.romaji || media.title.native;
                const embedImage = "https://img.anili.st/media/" + animeid;
                const description = parseHtmlText(media.description, 400);
                const genres = media.genres;
                if (genres.includes('Ecchi') || genres.includes('Hentai')) {
                    return interaction.editReply(`**${getLocalizedMessage('global', 'nsfw_block', interaction.locale)} ${animename}**\n${getLocalizedMessage('global', 'nsfw_block_reason', interaction.locale)}`);
                }
                const episode = data.result[0].episode;
                const similarity = (data.result[0].similarity * 100).toFixed(0);

                const embed = new EmbedBuilder()
                    .setTitle(`Anime: ${animename}`)
                    .setURL(media.siteUrl)
                    .setDescription(`${getLocalizedMessage('global', 'description', interaction.locale)}: ${description}`)
                    .addFields(
                        { name: `${getLocalizedMessage('search', 'appears_episode', interaction.locale)}`, value: `${episode}`, inline: true },
                        { name: `${getLocalizedMessage('search', 'similarity', interaction.locale)}`, value: `${similarity} %`, inline: true }
                    )
                    .setImage(embedImage);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                            .setURL(media.siteUrl)
                            .setStyle(ButtonStyle.Link)
                    );

                await interaction.editReply({ embeds: [embed], components: [row] });
                commandCooldown.set(interaction.user.id, Date.now());
            } else {
                interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            }
        } catch (error) {
            console.error(getLocalizedMessage('global', 'error'), error);
            if (interaction.replied || interaction.deferred) {
                return interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            } else {
                return interaction.reply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            }
        }
    },
};