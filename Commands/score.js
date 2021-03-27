const { MongoClient } = require("mongodb");
const URI = process.env.DBURI;
const initFuncs = require('./CommonFuncs/init');

module.exports = {
    name: '[score',
    description: 'Show your score',
    execute(msg, args) {

        const getScore = async (userId) => {
            const client = new MongoClient(URI);
            try {
                await client.connect();
                var db = client.db("meowchi");

                var user = await db.collection("accounts").findOne(
                    {accountId: userId},
                    {score: 1}
                );
                
                if (user.score === "N/A") {
                    msg.reply(`you currently don't have a rating!`);
                } else {
                    msg.reply(`you're currently rated ${user.score} meowchis!`);
                }
                
            } catch (e) {
                console.error(e);
                msg.reply(e);
            } finally {
                await client.close();
            }
        }

        const checkInit = (response) => {
            if (args.length != 0) {
                msg.reply("that's an invalid format! Try [score");
            } else if (!response) {
                msg.reply("you're not registered! Try [reg");
            } else {
                getScore(msg.author.id);
            }
        }

        initFuncs.find(msg.author.id).then((response) => {
            checkInit(response);
        })
    }

}