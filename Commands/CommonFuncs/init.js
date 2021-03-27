const { MongoClient } = require("mongodb");
const URI = process.env.DBURI;

// find(userID) seraches database for userID and returns true if it exists
const find = async (userID) => {
    const client = new MongoClient(URI); // init new mongoclient

    let found = false;

    try {
        await client.connect();
        const db = client.db('meowchi');

        if (await db.collection('accounts').countDocuments({accountId: userID}) !== 0) {
            found = true;
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    return found;
}

module.exports = { find }