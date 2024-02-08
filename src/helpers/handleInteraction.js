/*
 * File: handleInteraction.js
 * Project: steam-comment-bot-discord-plugin
 * Created Date: 20.12.2023 15:01:09
 * Author: 3urobeat
 *
 * Last Modified: 2024-02-08 23:07:16
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


const Discord = require("discord.js");

const DiscordBot = require("../bot.js");


/**
 * Store previous interactions for 15 min. One command can cause multiple replies but we can only reply to an interaction once, so we need to edit the message.
 * @type {{[key: string]: { message: Discord.Message, content: string, time: number }}}
 */
let previousInteractions = {};


/**
 * Checks previousInteractions collection for expired entries and removes them
 */
function cleanPreviousInteractions() {

    Object.keys(previousInteractions).forEach((e) => {
        let val = previousInteractions[e];

        if (val.time + 900000 < Date.now()) { // 15 min in ms
            logger("debug", `Discord Plugin: Cleaned out expired previousInteractions entry '${e}'`);

            delete previousInteractions[e];
        }
    });

}


/**
 * Sends a new interaction reply or edits an existing interaction reply message
 * @param {Discord.Interaction} interaction
 * @param {string} str
 */
async function handleInteractionReply(interaction, str) { // eslint-disable-line

    // Edit an existing interaction reply or send a new one
    let msgObj;
    let prevEntry = previousInteractions[interaction.id];

    if (prevEntry) {
        logger("debug", "Discord Plugin: Found existing interaction reply, editing message...");

        msgObj = await prevEntry.message.edit(prevEntry.content + "\n\n" + str) // Add new message content two newlines below
            .catch((err) => {
                logger("error", "Discord Plugin: Failed to edit interaction reply with updated response! " + err);
                msgObj = null;
            });
    } else {
        logger("debug", "Discord Plugin: Sending and storing new interaction reply...");

        msgObj = await interaction.reply(str)
            .catch((err) => {
                logger("error", "Discord Plugin: Failed to send interaction reply! " + err);
                msgObj = null;
            });
    }

    // Don't store interaction reply if sending failed
    if (!msgObj) return;

    // Check for outdated stored interactions and then store or update this interaction entry
    cleanPreviousInteractions();

    previousInteractions[interaction.id] = {
        message: msgObj,
        content: msgObj.message ? msgObj.message.content : str, // The initial reply does not include content because we aren't fetching the message, in which case will be used. Edit returns the full message and is then used instead.
        time: Date.now()
    };

}


/**
 * Handles interaction when user runs a command
 * @param {Discord.Interaction} interaction
 */
DiscordBot.prototype.handleInteraction = function(interaction) {
    if (interaction.type != Discord.InteractionType.ApplicationCommand) return; // Ignore any non-cmd interactions

    // Create old styled args array which the Comment Bot understands. The order of this array will follow the order of the options registered in registerCommands()
    let args = interaction.options.data.map(e => e.value);

    // Ask the CommandHandler to run the associated command for us
    let cmd = this.plugin.commandHandler.runCommand(
        interaction.commandName,
        args,
        (x, y, msg) => handleInteractionReply(interaction, msg),
        this,
        {
            cmdprefix: "/",
            userID: interaction.user.id,
            ownerIDs: this.plugin.pluginConfig.owners
        }
    );

    // Log command usage, map arguments provided into a string
    logger("info", `Discord Plugin: User '${interaction.user.username}' (${interaction.user.id}) ran command: /${interaction.commandName} ${interaction.options.data.map((e) => `${e.name}: ${e.value}`).join(", ")}`);

    // Check if command was not found. This shouldn't be possible as we are using interactions but let's make sure
    if (!cmd) interaction.reply("This command was not found!");
};
