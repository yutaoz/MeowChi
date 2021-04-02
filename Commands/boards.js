const { MongoClient } = require("mongodb");
const URI = process.env.DBURI;
const Discord = require("discord.js");
const initFuncs = require('./CommonFuncs/init');

module.exports = {
    name: '[boards',
    description: 'Show leaderboards',
    execute(msg, args) {
        const client = new MongoClient(URI);
        var boardValues = [];
        

            const getBoards = async () => {
                try {
                    await client.connect();
                    var db = client.db("meowchi");
                    await db.collection("accounts").find().forEach((doc) => {
                        let boardData = {
                            user: doc.accountName,
                            score: doc.score,
                            total: doc.numRatings
                        }
                        boardValues.push(boardData);
                    });

                    const compare = (a, b) => {
                        if (a.score > b.score) {
                            return -1;
                        } else if (a.score < b.score) {
                            return 1;
                        } else {
                            if (a.total > b.total) {
                                return -1;
                            } else if (a.total < b.total) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }

                    boardValues.sort(compare);
                    console.log("aasdfasdf" + boardValues[0]);

                    const commandEmbed = new Discord.MessageEmbed()
                        .setColor("#F2BAC9")
                        .setTitle("Leaderboard")
                        .addFields(
                            { name: `1. ${(boardValues[0] ? boardValues[0].user : "None yet!")}`, 
                            value: `Score: ${(boardValues[0] ? parseFloat(boardValues[0].score).toFixed(1) : "None yet!")}` },
                            { name: `2. ${(boardValues[1] ? boardValues[1].user : "None yet!")}`, 
                            value: `Score: ${(boardValues[1] ? parseFloat(boardValues[1].score).toFixed(1) : "None yet!")}` },
                            { name: `3. ${(boardValues[2] ? boardValues[2].user : "None yet!")}`, 
                            value: `Score: ${(boardValues[2] ? parseFloat(boardValues[2].score).toFixed(1) : "None yet!")}` },
                            { name: `4. ${(boardValues[3] ? boardValues[3].user : "None yet!")}`, 
                            value: `Score: ${(boardValues[3] ? parseFloat(boardValues[3].score).toFixed(1) : "None yet!")}` },
                            { name: `5. ${(boardValues[4] ? boardValues[4].user : "None yet!")}`, 
                            value: `Score: ${(boardValues[4] ? parseFloat(boardValues[4].score).toFixed(1) : "None yet!")}` }
                        );

                    msg.channel.send(commandEmbed);
                    
                } catch (e) {
                    console.error(e);
                    msg.reply(e);
                } finally {
                    await client.close();
                }
            }

            const checkInit = () => {
                if (args.length != 0) {
                    msg.reply("that's an invalid format! Try [boards");
                } else {
                    getBoards();
                }
            }

            checkInit();

    }
}