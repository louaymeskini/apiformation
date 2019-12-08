var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var user= require("./userModel")

var Schema = mongoose.Schema;


var adminModelSchema = user.discriminator("admin", new Schema({
        nom: {
            type: String,
            trim: true,
            required: true,
        },
        prenom: {
            type: String,
            trim: true,
            required: true,
        }
    },
    {
        timestamps: true
    }));

// Compile model from schema
var adminModel = mongoose.model('admin');
module.exports=adminModel;
