const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('path');
const root = path.dirname(require.main.filename);

const commands = [];
// Grab all the command folders from the commands directory you created earlier

console.log(__dirname);
console.log(root);


const foldersPath = path.join(root, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.bot_token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set

        //!Global Slash Command Deployment
        // const data = await rest.put(
        //     Routes.applicationCommands(process.env.appID),
        //     { body: [] },
        // );
        //!Specific Slash Command Deployment
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.appID, process.env.serverID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();