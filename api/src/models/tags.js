const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    name:String
});
module.exports =  tagsSchema;