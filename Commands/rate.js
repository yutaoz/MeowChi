const { MongoClient } = require("mongodb");
const URI = process.env.DBURI;
const initFuncs = require('./CommonFuncs/init');

module.exports = {
    name: '[rate',
    description: 'Rates target user',
    execute(msg, args) {

        const sendRate = async (sentId, score) => {
            const client = new MongoClient(URI);
            try {
                await client.connect();
                var db = client.db("meowchi");
                var receiver = await db.collection("accounts").findOne(
                    {accountId: sentId},
                    {accountName: 1, score: 1, totalScore: 1, numRatings: 1}
                );
                //accountName: msg.author.username

                var sender = await db.collection("accounts").findOne(
                    {accountId: msg.author.id},
                    {accountName: 1, score: 1, totalScore: 1, numRatings: 1}
                );

                var weightedScore = (sender.score === "N/A" ? score * 3 : score * sender.score);
                console.log(sender.score === "N/A");
                var weightedRatings = (sender.score === "N/A" ? 3 : sender.score);
                console.log(weightedRatings);
                var mentioned = msg.mentions.users.first();

                await db.collection("accounts").updateOne(
                    {   accountId: msg.author.id },
                    {
                        $set: {accountName: msg.author.username}
                    }
                );

                if (receiver.score === "NA") {
                    await db.collection("accounts").updateOne(
                        {   accountId: sentId },
                        {
                            $set: {accountName: mentioned.username, score: score, totalScore: weightedScore, numRatings: weightedRatings}
                        }
                    );
                } else {
                    await db.collection("accounts").updateOne(
                        {   accountId: sentId },
                        {
                            $set: {accountName: mentioned.username, totalScore: receiver.totalScore + weightedScore, numRatings: receiver.numRatings + weightedRatings}
                        }
                    );

                    var receiver2 = await db.collection("accounts").findOne(
                        {accountId: sentId},
                        {score: 1, totalScore: 1, numRatings: 1}
                    );

                    await db.collection("accounts").updateOne(
                        {   accountId: sentId },
                        {
                            $set: {score: receiver2.totalScore / receiver2.numRatings}
                        }
                    );
                }
                msg.reply("your rating was successful!");


            } catch (e) {
                console.error(e);
                msg.reply(e);
            } finally {
                await client.close();
            }

        }

        const rateCheck = async (sender) => {
            const client = new MongoClient(URI);

            try {
                await client.connect();
                var db = client.db("meowchi");

                var user = await db.collection("accounts").findOne(
                    {accountId: sender},
                    {lastRate: 1}
                );

                var lastUse = user.lastRate;
                var currentDate = new Date;
                const HOUR = 1000 * 60 * 60;

                if (lastUse === "N/A") { // newly initiated accounts
                    await db.collection("accounts").updateOne(
                        {   accountId: sender },
                        {
                            $set: {lastRate: currentDate}
                        }
                    );

                    sendRate(msg.mentions.users.first().id, parseInt(args[1])).then((response) => {
                        console.log(response);
                    });
                } else if (currentDate - lastUse < HOUR) {
                    msg.reply(`you can't rate for another ${((HOUR - (currentDate - lastUse)) / 1000 / 60).toFixed(0)} mins`);
                } else {
                    await db.collection("accounts").updateOne(
                        {   accountId: sender },
                        {
                            $set: {lastRate: currentDate}
                        }
                    );
                    sendRate(msg.mentions.users.first().id, parseInt(args[1])).then((response) => {
                        console.log(response);
                    });
                }
            } catch (e) {
                console.error(e);
                msg.reply(e);
            } finally {
                await client.close();
            }

        }

        

        
        const checkValid = (response1, response2) => {
            if (args.length !== 2 || (msg.mentions.users.size !== 1) || args[0] !== `<@!${msg.mentions.users.first().id}>`) {
                msg.reply("that's an invalid format, try [rate <@user> <1-5>");
            } else if (parseInt(args[1]) <= 0 || parseInt(args[1]) > 5 || args[1] === "NaN") {
                msg.reply("invalid value!");
            } else if (msg.author.id === msg.mentions.users.first().id) {
                msg.reply("you can't rate yourself!");
            } else if (!response1) {
                msg.reply("register yourself with [reg first!");
            } else if (!response2) {
                msg.reply("you can't rate an unregistered user!");
            } else if (args[1].match(/[^\d]/)) {
                msg.reply("rating must be an integer from 1-5.");
            } else {
                msg.reply("verifying rating...");
                rateCheck(msg.author.id).then((response) => {

                    console.log(response);
                })
                console.log(parseInt(args[1]));

            }
        }
        initFuncs.find(msg.author.id).then((response1) => {
            initFuncs.find(msg.mentions.users.first().id).then((response2) => {
                console.log(response1 + " | " + response2);
                checkValid(response1, response2);
            });
        }) ;
    }
}