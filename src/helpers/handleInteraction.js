/*
 * File: handleInteraction.js
 * Project: steam-comment-bot-discord-plugin
 * Created Date: 20.12.2023 15:01:09
 * Author: 3urobeat
 *
 * Last Modified: 20.12.2023 15:50:44
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


const Discord = require("discord.js");

const DiscordBot = require("../bot.js");


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
        (x, y, msg) => {
            interaction.reply(msg);
        },
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
