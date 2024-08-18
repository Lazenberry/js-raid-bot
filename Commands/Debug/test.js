const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git-repo')
        .setDescription('Returns the github repo'),
    async execute(interaction) {
        await interaction.reply('https://github.com/Lazenberry/js-raid-bot');
    },
};