require("module-alias/register")
require("dotenv").config()

//!Discord Client

const Discord = require("discord.js")

const client = new Discord.Client({
    intents: [
        "MessageContent"
    ]
})

client.on("ready", () => {
    console.log("Bot Started");
})

client.login(process.env.bot_token)

