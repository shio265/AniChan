import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { handleInteractionError } from '../../handlers/errorHandler.js';
import { getCommandLocalization, getLocalizedMessage } from './../../utils/localizations.js';
import { isNSFWFilterEnabled, setNSFWFilterEnabled } from './../../utils/guildSettings.js';

export default {
    data: (() => {
        const localization = getCommandLocalization('nsfwfilter');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations)
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .addBooleanOption(option => option
                .setName('enabled')
                .setDescription(getLocalizedMessage('nsfwfilter', 'enabled_option'))
                .setRequired(true));
    })(),
    async execute(interaction) {
        try {
            if (!interaction.guildId) {
                return interaction.reply(getLocalizedMessage('nsfwfilter', 'no_guild', interaction.locale));
            }

            const enabled = interaction.options.getBoolean('enabled', true);
            setNSFWFilterEnabled(interaction.guildId, enabled);

            const currentState = isNSFWFilterEnabled(interaction.guildId);
            await interaction.reply(
                currentState
                    ? getLocalizedMessage('nsfwfilter', 'enabled_message', interaction.locale)
                    : getLocalizedMessage('nsfwfilter', 'disabled_message', interaction.locale)
            );
        } catch (error) {
            await handleInteractionError(error, interaction);
        }
    },
};
