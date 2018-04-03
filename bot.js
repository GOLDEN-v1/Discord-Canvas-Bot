"use strict";

const config = require("./config.json");

// List with detailed info about command
const commands = require("./commands.json");
// List with commands and aliases like {alias: original-command}
let commandnames = {};
// Command executables like {name: function(msg, command, args)}
let commandexecs = {};
// Fill in commandsnames and commandexecs
for (let name in commands) {
  // Load the command from file
  commandexecs[name] = require("./commands/" + name + ".js");
  // Add the basic command
  commandnames[name] = name;
  // Add its aliases
  for (let i = 0; i < commands[name].aliases.length; i++) {
    commandnames[commands[name].aliases[i]] = name;
  }
}
console.log(`${Object.keys(commands).length} commands loaded.`);

const util = require("util");
const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {
  console.log("Bot connected and ready!");
  bot.user.setActivity("with art");
});

bot.on("message", (msg) => {
  if (msg.content.startsWith(config.prefix)) {
    let command = msg.content.substr(config.prefix.length);
    let args = command.split(" ");
    command = args[0];
    args = args.slice(1);
    console.log(msg.author.tag + " entered command \"" + command + "\" with args " + JSON.stringify(args));
    execCommand(msg, command, args);
  }
});

bot.login(config.discordtoken);

function execCommand(msg, command, args) {
  if (command === "help") {
    if (args[0]) {
      msg.reply(generateCmdHelp(args[0]));
      return
    }
    msg.reply(generateHelp());
    return;
  }
  if (commandnames[command]) {
    let cmd = commandnames[command];
    if (args.length < commands[cmd].reqargs) {
      msg.reply(generateCmdSyntaxError(cmd));
      return;
    }
    commandexecs[cmd].exec(msg, command, args);
    return;
  }
  console.log("Unknown command " + command);
}

function generateHelp() {
  let help = `**CanvasBot Help:**\n__Commands:__\n`;
  for (let name in commands) {
    help += name + " - " + commands[name].description + "\n";
  }
  help += `\nFor further information about a specific command, use \`${config.prefix}help <commandname>\`.`;
  return help;
}

function generateCmdHelp(command) {
  var name = commandnames[command];
  var cmd = commands[name];
  return `Help for command \`${config.prefix}${name}\`:
__Description:__ ${cmd.description}${(cmd.aliases.length > 0) ? "\n__Aliases:__ " : ""}${cmd.aliases.join(", ")}
__Usage:__ ${config.prefix}${name} ${cmd.usage}
__Examples:__
 - ${config.prefix}${name} ${cmd.examples.join("\n - " + config.prefix + name + " ")}`;
}

function generateCmdSyntaxError(command) {
  var name = commandnames[command];
  var cmd = commands[name];
  return `__Error:__ Invalid Syntax!
__Usage:__ ${cmd.usage}
__Example:__ ${cmd.examples[0]}
For further information, please use \`${config.prefix}help ${name}\`!`;
}