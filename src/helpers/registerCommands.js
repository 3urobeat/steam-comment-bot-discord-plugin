/*
 * File: registerCommands.js
 * Project: steam-comment-bot-discord-plugin
 * Created Date: 2023-07-06 18:27:16
 * Author: 3urobeat
 *
 * Last Modified: 2024-02-08 23:14:02
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
 * Register all Steam Comment Bot commands as slash commands
 */
DiscordBot.prototype.registerCommands = function() {
    let commandList = this.plugin.commandHandler.commands;

    logger("debug", `Discord Plugin: Registering ${commandList.length} commands...`);

    // Loop over all commands
    for (const e of commandList) {

        // Construct command object
        let thiscmd = {
            name: e.names[0].toLowerCase().slice(0, 32), // Only register the first alias
            description: e.description.slice(0, 100),
            options: []
        };

        // Convert our arg objects to the options structure of discord.js
        for (const arg of e.args) {
            let thisarg = {
                name: arg.name.replace(/ /g, "_").replace(/"/g, "").toLowerCase().slice(0, 32),
                description: arg.description.slice(0, 100),
                required: !arg.isOptional // TODO: Certain params become required when called from outside Steam
            };

            // TODO: Support other arg types?
            if (arg.type == "string") thisarg.type = Discord.ApplicationCommandOptionType.String;

            // Push this argument to the array of options
            thiscmd.options.push(thisarg);
        }

        // Register our command
        this.bot.application.commands.create(thiscmd);                            // Release
        //this.bot.guilds.cache.get("232550371191554051").commands.create(thiscmd); // Testing

    }
};
