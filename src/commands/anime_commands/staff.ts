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
            await handleInteractionError(error, interaction);
        }
    },
};
