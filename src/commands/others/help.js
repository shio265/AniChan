const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require("fs");
const path = require('path');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');

module.exports = {
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

            const commandsDirectory = path.join(__dirname, '..');
            const commandFolders = fs.readdirSync(commandsDirectory).filter(file => fs.statSync(path.join(commandsDirectory, file)).isDirectory());

            for (const folder of commandFolders) {
                const folderPath = path.join(commandsDirectory, folder);
                const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(folderPath, file);
                    try {
                        const command = require(filePath);
                        if (!command?.data?.name || !command?.data?.description) {
                            console.warn(`Warning: Invalid command module structure: ${filePath}`);
                            continue;
                        }
                        embed.addFields({ name: command.data.name, value: command.data.description });
                    } catch (loadError) {
                        console.error(`Failed to load command: ${filePath}`, loadError.message);
                    }
                }
            }

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(getLocalizedMessage('global', 'error'), error);
            const errorMessage = getLocalizedMessage('global', 'error_reply', interaction.locale);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};