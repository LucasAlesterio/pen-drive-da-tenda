const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    user:String,
    photograph:String,
    friends:[String],
    favorites:[String],
    links:[String]
});
module.exports = mongoose.model('User',usersSchema);