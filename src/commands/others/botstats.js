const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');

module.exports = {
    data: (() => {
        const localization = getCommandLocalization('stats');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })(),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor(uptime / 3600) % 24;
            const minutes = Math.floor(uptime / 60) % 60;
            const seconds = Math.floor(uptime % 60);
            const embed = new EmbedBuilder()
                .setTitle(`${getLocalizedMessage('stats', 'title', interaction.locale)}`)
                .setColor('#66ffff')
                .setFields(
                    {
                        name: `${getLocalizedMessage('stats', 'ping', interaction.locale)}`,
                        value: `${interaction.client.ws.ping}ms`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'uptime', interaction.locale)}`,
                        value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'version', interaction.locale)}`,
                        value: `v${require('../../../package.json').version}`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'cpu', interaction.locale)}`,
                        value: `${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'ram', interaction.locale)}`,
                        value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'disk_usage', interaction.locale)}`,
                        value: `${(process.memoryUsage().external / 1024 / 1024).toFixed(2)} MB`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'os', interaction.locale)}`,
                        value: `${process.platform} ${process.arch}`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'node', interaction.locale)}`,
                        value: `${process.version}`,
                        inline: true,
                    },
                    {
                        name: `${getLocalizedMessage('stats', 'library', interaction.locale)}`,
                        value: `Discord.js v${require('discord.js').version}`,
                        inline: true,
                    },
                )
                .setFooter({ text: `Powered by STelliNeX | STNX Teams` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(getLocalizedMessage('global', 'error'), error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            } else {
                await interaction.reply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            }
        }
    }
};