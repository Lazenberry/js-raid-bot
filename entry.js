require("module-alias/register")
require("dotenv").config()
const fs = require("fs")
const path = require("path")

try {
    if (process.argv[2] == "true") {
        console.log("Hello");

        require("./Config/deploy-slashCommands")
    } else {
        throw new Error("CBA")
    }

} catch (error) {
    if (error.message !== "CBA") {
        console.log(error);
    }


    //!Discord Client

    const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

    const client = new Client({
        intents: [
            "MessageContent",
            "DirectMessages",
        ]
    })

    client.on("ready", () => {
        console.log("Bot Started");
    })

    client.commands = new Collection()

    const foldersPath = path.join(__dirname, 'Commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    //! For Slash Commands
    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
        // console.log("instance: ", interaction)

    })

    client.on(Events.MessageCreate, async i => {
        console.log("Message Event");

    })

    //! All Code Above This

    client.login(process.env.bot_token)
}






