/*
 * File: bot.js
 * Project: steam-comment-bot-discord-plugin
 * Created Date: 06.07.2023 18:08:39
 * Author: 3urobeat
 *
 * Last Modified: 06.07.2023 21:23:42
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
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

    // Create a new Discord Bot instance
    this.bot = new Discord.Client({
        intents: []
    });

    // Attach our event handlers
    this.attachEventHandlers();
};

module.exports = DiscordBot;


DiscordBot.prototype.attachEventHandlers = function() {

    // Attach ready event to get notified when the bot is logged in
    this.bot.on("ready", () => {
        logger("info", "Discord Plugin: Logged in!");
    });

};


DiscordBot.prototype.login = function() {

    // TODO: Check if no token was provided and abort

    // Login using the token set in the config
    this.bot.login(this.plugin.pluginConfig.token);

};


DiscordBot.prototype.logout = function() {
    this.bot.destroy();
    delete this.bot;
};