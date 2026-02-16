const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');

module.exports = {
    data: (() => {
        const localization = getCommandLocalization('weather');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations)
            .addStringOption(option => option.setName('location').setDescription(getLocalizedMessage('weather', 'location')).setRequired(true));
    })(),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const location = interaction.options.getString('location');

            weather.find({ search: location, degreeType: 'C' }, async function (error, result) {
                if (error) {
                    console.error(`${getLocalizedMessage('global', 'error', interaction.locale)}`, error);
                    return interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
                }
                if (result === undefined || result.length === 0) {
                    return interaction.editReply(`${getLocalizedMessage('global', 'no_results', interaction.locale)}`);
                }

                const current = result[0].current;
                const location = result[0].location;

                const embed = new EmbedBuilder()
                    .setTitle(current.observationpoint)
                    .setDescription(`${current.skytext}`)
                    .setThumbnail(current.imageUrl)
                    .setTimestamp()
                    .addFields(
                        {
                            name: getLocalizedMessage('weather', 'longitude', interaction.locale),
                            value: location.long,
                            inline: true,
                        },
                        {
                            name: getLocalizedMessage('weather', 'latitude', interaction.locale),
                            value: location.lat,
                            inline: true,
                        },
                        {
                            name: getLocalizedMessage('weather', 'degreetype', interaction.locale),
                            value: `°${location.degreetype}`,
                            inline: true,
                        },
                        {
                            name: `${getLocalizedMessage('weather', 'current_temperature', interaction.locale)}`,
                            value: `${current.temperature}°${location.degreetype}`,
                            inline: true,
                        },
                        {
                            name: `${getLocalizedMessage('weather', 'feels_like', interaction.locale)}`,
                            value: `${current.feelslike}°${location.degreetype}`,
                            inline: true,
                        },
                        {
                            name: `${getLocalizedMessage('weather', 'winddisplay', interaction.locale)}`,
                            value: `${current.winddisplay}`,
                            inline: true,
                        },
                        {
                            name: `${getLocalizedMessage('weather', 'humidity', interaction.locale)}`,
                            value: `${current.humidity}%`,
                            inline: true,
                        },
                        {
                            name: `${getLocalizedMessage('weather', 'observationtime', interaction.locale)}`,
                            value: `${current.observationtime}, GMT ${location.timezone}`,
                            inline: true,
                        }
                    )
                    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) })
                    .setColor('#66FFFF');

                await interaction.editReply({ embeds: [embed], ephemeral: true });
            });
        } catch (error) {
            console.error(`${getLocalizedMessage('global', 'error', interaction.locale)}`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            } else {
                await interaction.reply(`${getLocalizedMessage('global', 'error_reply', interaction.locale)}`);
            }
        }
    },
};
