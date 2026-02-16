const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLocalizedMessage, getCommandLocalization } = require('./../../utils/localizations.js');

module.exports = {
    data: (() => {
        const localization = getCommandLocalization('avatar');
        return new SlashCommandBuilder()
            .setName(localization.name)
            .setNameLocalizations(localization.nameLocalizations)
            .setDescription(localization.description)
            .setDescriptionLocalizations(localization.descriptionLocalizations);
    })()
        .addUserOption(option =>
            option.setName('user')
                .setDescription(getLocalizedMessage('avatar', 'user_name'))
                .setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser('user');
            const member = interaction.guild.members.cache.find(m => m.user.id === user.id) || interaction.member;

            const avatar = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });

            const embed = new EmbedBuilder()
                .setTitle(`${member.user.username} Avatar`)
                .setURL(avatar)
                .setImage(avatar)
                .setFooter({
                    text: `${getLocalizedMessage('avatar', 'requested_by', interaction.locale)}: ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
                })
                .setColor('#eb3434');

            await interaction.editReply({ embeds: [embed] });
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