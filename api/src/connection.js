const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb+srv://twm-user:N4bnMwfPxzdy@cluster-twm.vz2ed.mongodb.net/twm?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = client;

/*
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
*/