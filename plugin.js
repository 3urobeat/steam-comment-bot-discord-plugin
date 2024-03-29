/*
 * File: plugin.js
 * Project: steam-comment-bot-discord-plugin
 * Created Date: 2023-07-05 12:26:40
 * Author: 3urobeat
 *
 * Last Modified: 2024-02-08 23:13:31
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


let logger = require("output-logger"); // eslint-disable-line

// Note: These paths will break when the plugin is loaded. Use them only while developing using 'npm link' for IntelliSense as described here: https://github.com/3urobeat/steam-comment-service-bot/blob/master/docs/wiki/creating_plugins.md#additional-information
//const PluginSystem = require("../steam-comment-service-bot/src/pluginSystem/pluginSystem.js"); // eslint-disable-line
//const Bot          = require("../steam-comment-service-bot/src/bot/bot.js");                   // eslint-disable-line
// Do not forget to comment them out when publishing your plugin!

const pluginPackage = require("./package.json"); // eslint-disable-line

const DiscordBot = require("./src/bot.js");


/**
 * Constructor - Creates a new object for this plugin
 * @class
 * @param {PluginSystem} sys Your connector to the application
 */
const Plugin = function(sys) {
    logger = sys.controller.logger; // Overwrites logger function from lib with our modified one. Import above remains to keep IntelliSense support

    // Store references to commonly used properties
    this.sys            = sys;
    this.controller     = sys.controller;
    this.data           = sys.controller.data;
    this.commandHandler = sys.commandHandler;

    // Create a new Discord Bot object
    this.discord = new DiscordBot(this);
};

// Export everything in this file to make it accessible to the plugin loader
module.exports = Plugin;


/**
 * This function will be called by the plugin loader after updating but before logging in. Initialize your plugin here.
 */
Plugin.prototype.load = async function() {
    logger("info", "Discord Plugin: Initializing...", false, false, null, logger.animation("loading"));

    this.pluginConfig = await this.sys.loadPluginConfig(pluginPackage.name); // Load your config

    this.discord.login();
};


/**
 * This function will be called when the bot is ready (aka all accounts were logged in).
 */
Plugin.prototype.ready = async function() {};


/**
 * This function is called when the !reload command is executed
 * This plugin doesn't really have anything that needs to be unloaded (for example shutting down a webserver) but including an empty function will suppress a warning.
 */
Plugin.prototype.unload = function () {
    this.discord.logout();
    delete this.discord;
};


/**
 * Called when a bot account changes it status
 * @param {Bot} bot The bot object that changed status
 * @param {Bot.EStatus} oldStatus The old status it had
 * @param {Bot.EStatus} newStatus The new status it now has
 */
Plugin.prototype.statusUpdate = function(bot, oldStatus, newStatus) {}; // eslint-disable-line


/**
 * Called when a Steam Guard Code is requested for a bot account
 * @param {Bot} bot The bot object of the affected account
 * @param {function(string): void} submitCode Function to submit a code. Pass an empty string to skip the account.
 */
Plugin.prototype.steamGuardInput = function(bot, submitCode) {}; // eslint-disable-line
