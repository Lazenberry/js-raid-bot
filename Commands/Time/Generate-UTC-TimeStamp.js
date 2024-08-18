const { SlashCommandBuilder, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } = require('discord.js');

// const TimeZoneAbrv = require("../../Config/arrayOfTimezoneAbrv.json")
// const TimeZoneAbrv2 = require("../../Config/arrayOfTimezoneAbrv2.json")

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {

    data: new SlashCommandBuilder()
        .setName('generate-raid-time')
        .setDescription('Generates a UTC Timestamp')
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("Date in DD-MM-YYYY Format, Example: 04-03-2002")
                .setRequired(true)
        ).addStringOption(option =>
            option
                .setName("time")
                .setDescription("Time in 07:00 Format, Example: 17:00")
                .setRequired(true)
        )
    // .addStringOption(option =>
    //     option
    //         .setName("timezone")
    //         .setDescription("Current Timezone, Example: Europe/Madrid is CEST")
    //         .setRequired(true)
    //         .setAutocomplete(true)
    // ),
    // ,
    // async autocomplete(interaction) {
    //     const focusedOption = interaction.options.getFocused(true);

    //     if (focusedOption.name === 'timezone') {
    //         choices = TimeZoneAbrv2;

    //         const filtered = choices.filter(choice => choice.includes(focusedOption.value));

    //         await interaction.respond(
    //             filtered.map(choice => ({ name: choice, value: choice })),
    //         );
    //     }
    // }
    ,
    async execute(interaction) {
        var UTC_TIME;
        var inputDate = interaction.options.getString("date")
        var split;
        if (inputDate.includes("-")) {
            split = inputDate.split("-")
        } else if (inputDate.includes("/")) {
            split = inputDate.split("/")
        }
        var date_string = `${split[2]}${split[1]}${split[0]} ${interaction.options.getString("time")}`
        var UTC_TIME = dayjs(date_string)/*.tz(interaction.options.timezone)*/.unix();

        await interaction.reply(`Raid Date: <t:${UTC_TIME}:F>, that's <t:${UTC_TIME}:R>`);
    },
};