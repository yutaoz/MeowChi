const { MongoClient } = require("mongodb");
const URI = process.env.DBURI;
const initFuncs = require('./CommonFuncs/init');

module.exports = {
    name: '[reg',
    description: 'Initialize user into database',
    execute(msg, args) {
        const initialize = async () => {
            const client = new MongoClient(URI);
            try {
                await client.connect();
                const db = client.db("meowchi");

                var data = {
                    accountName: msg.author.username,
                    accountId: msg.author.id,
                    displayPic: msg.author.avatarURL(),
                    score: 'N/A'
                }

                db.collection("accounts").insertOne(data, function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        msg.reply("successful registration!");
                    }
                });
            } catch (e) {
                console.error(e);
                msg.reply(e);
            } finally {
                await client.close();
            }
        }

        const checkInit = (response) => {
            if (args.length != 0) {
                msg.reply("that's an invalid format! Try [reg");
            } else if (response) {
                msg.reply("you're already registered!");
            } else {
                initialize();
            }
        }

        initFuncs.find().then((response) => {
            checkInit(response);
        });

        
    }
}