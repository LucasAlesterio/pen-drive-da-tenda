const mongoose = require('mongoose');

const typesSchema = new mongoose.Schema({
    name:String
});
module.exports = typesSchema;