/*
 * File: bot.js
 * Project: steam-comment-bot-discord-plugin
 * Created Date: 2023-07-06 18:08:39
 * Author: 3urobeat
 *
 * Last Modified: 2024-02-08 23:13:49
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


const Discord = require("discord.js");

const Plugin = require("../plugin.js"); // eslint-disable-line

let logger;


/**
 * Creates a Discord Bot Instance
 * @param {Plugin} plugin The plugin instance of this plugin
 */
const DiscordBot = function(plugin) {
    this.plugin = plugin;
    logger = this.plugin.controller.logger;

    // Load all helpers
    require("./helpers/handleInteraction.js");
    require("./helpers/registerCommands.js");

    // Create a new Discord Bot instance
    this.bot = new Discord.Client({
        intents: []
    });

    // Attach our event handlers
    this.attachEventHandlers();
};

module.exports = DiscordBot;


/**
 * Attaches Discord event handlers
 */
DiscordBot.prototype.attachEventHandlers = function() {

    // Attach ready event to get notified when the bot is logged in
    this.bot.on("ready", () => {
        logger("info", "Discord Plugin: Logged in!");

        // Set first game in Steam Bot config as status
        let game = this.plugin.data.config.playinggames[0];

        if (game && typeof game == "string") {
            this.bot.user.setPresence({
                activities: [{ name: game, type: 0 }], // Type 0 is playing
                status: "online"
            });
        }

        // Register all commands from the bot
        this.registerCommands(); // TODO: Commands added by plugins at runtime will probably be missing
    });

    // Let handleInteraction helper handle the interaction
    this.bot.on("interactionCreate", (interaction) => {
        this.handleInteraction(interaction);
    });

};


/**
 * Logs into Discord
 */
DiscordBot.prototype.login = function() {
    if (!this.plugin.pluginConfig.token) return logger("error", "Discord Plugin: Failed to login, no token set in config!");

    // Login using the token set in the config
    this.bot.login(this.plugin.pluginConfig.token);
};


/**
 * Logs out of Discord
 */
DiscordBot.prototype.logout = function() {
    this.bot.destroy();

    delete this.bot;
};


/* -------- Register functions to let the IntelliSense know what's going on in helper files -------- */

/**
 * Handles interaction when user runs a command
 * @param {Discord.Interaction} interaction
 */
DiscordBot.prototype.handleInteraction = function(interaction) {}; // eslint-disable-line

/**
 * Register all Steam Comment Bot commands as slash commands
 */
DiscordBot.prototype.registerCommands = function() {};
