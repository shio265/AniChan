const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');
const { parseHtmlText } = require('./../../utils/textParser.js');
const { queryAnilistFromFile } = require('./../../hook/anilist.js');

module.exports = {
    data: (() => {
        const localization = getCommandLocalization('staff');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
        .addStringOption(option => option.setName('name').setDescription(getLocalizedMessage('staff', 'staff_name')).setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const staffName = interaction.options.getString('name');
            const queryPath = path.join(__dirname, '../../queries/staff.graphql');
            const variables = { search: staffName };

            const data = await queryAnilistFromFile(queryPath, variables);
            const staffData = data.data.Staff;

            if (!staffData) {
                return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)} **${staffName}**`);
            }

            const description = parseHtmlText(staffData.description, 1000) || getLocalizedMessage('global', 'unavailable', interaction.locale);
            
            const embed = new EmbedBuilder()
                .setTitle(`${getLocalizedMessage('staff', 'staff_info', interaction.locale)}: ${staffData.name.first} ${staffData.name.last}`)
                .setURL(staffData.siteUrl)
                .setDescription(description)
                .setImage(staffData.image.large)
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(getLocalizedMessage('global', 'view_anilist', interaction.locale))
                        .setURL(staffData.siteUrl)
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