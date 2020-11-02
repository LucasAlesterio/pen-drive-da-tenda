const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema({
    nStars:Number,
    user:String
});
module.exports =  ratingsSchema;