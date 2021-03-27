const Discord = require("discord.js");

module.exports = {
    name: '[help',
    description: 'Displays commands',
    execute(msg, args) {
        const commandEmbed = new Discord.MessageEmbed()
            .setColor("#F2BAC9")
            .setTitle("Commands")
            .addFields(
                { name: "[reg", value: "Registers user so you can start rating!" },
                { name: "[rate <@user> <score>", value: "Rates a user"},
                { name: "[score", value: "Shows user's rating"},
                { name: "[boards", value: "Shows leaderboard of ratings"}
            );

        msg.channel.send(commandEmbed);
    }

}