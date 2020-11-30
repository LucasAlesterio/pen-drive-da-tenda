const mongoose = require('mongoose');
const ratingsSchema = require('./ratings');
const tagsSchema = require('./tags'); 
const typesSchema = require('./types');

const linksSchema = new mongoose.Schema({
    name:String,
    user:String,
    link:String,
    description:String,
    photograph:String,
    rating:[ratingsSchema],
    type:typesSchema,
    tag:[tagsSchema],
    idImg:String,
    average:Number,
    mini:String
});
module.exports = mongoose.model('Links',linksSchema);