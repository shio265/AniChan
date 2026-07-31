import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';

const commandNames = [
    'anime',
    'characters',
    'character_search',
    'manga',
    'popular',
    'staff',
    'studio',
    'trending',
    'user',
    'avatar',
    'help',
    'nsfwfilter',
    'weather',
];

export default {
    data: (() => {
        const localization = getCommandLocalization('help');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })(),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const embed = new EmbedBuilder()
                .setTitle(getLocalizedMessage('help', 'command_title', interaction.locale))
                .setDescription(getLocalizedMessage('help', 'embed_description'))
                .setTimestamp();

            for (const commandName of commandNames) {
                const localization = getCommandLocalization(commandName);
                embed.addFields({ name: localization.name, value: localization.description });
            }

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            await handleInteractionError(error, interaction);
        }
    },
};
