//const connection = require('../connection');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://twm-user:N4bnMwfPxzdy@cluster-twm.vz2ed.mongodb.net/twm?retryWrites=true&w=majority',
    {useNewUrlParser: true,useUnifiedTopology: true});
const db = mongoose.connection;

module.exports = {
    async addUser(request,response){
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log("Conectado!");
        });
        return response.status(200).send('cadastrado');
    },
    async login(request,response){
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            return response.status(200).send('Conectado');
        });
        return response.status(200).send('Não conectado');
    }
}
