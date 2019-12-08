var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var user= require("./userModel")

var Schema = mongoose.Schema;


var benevoleModelSchema = user.discriminator("benevole", new Schema({
    nom: {
        type: String,
        trim: true,
        required: true,
    },
    prenom: {
        type: String,
        trim: true,
        required: true,
    },
    sexe: {
        type: String,
        trim: true,
        required: true,
    },
    ville: {
        type: String,
        trim: true,
        required: true,
    },
    adresse: {
        type: String,
        trim: true,
        required: true,
    },
    codePostale: {
        type: Number,
        trim: true,
        required: true,
    },
    tel: {
        type: Number,
        trim: true,
        required: true,
    },
        associations:[
            {
                type: mongoose.Schema.Types.ObjectId, ref:"association"
            }
        ],
        evenements:[
            {
                type: Schema.Types.ObjectId, ref:"evenementModel"
            }
        ],
        annonces:[
            {
                type: Schema.Types.ObjectId, ref:"annonceModel"
            }
        ],
        dons:[
            {
                type: Schema.Types.ObjectId, ref:"donModel"
            }
        ]
    },
    {
        timestamps: true
    }));


// Compile model from schema
var benevoleModel = mongoose.model('benevole');
module.exports=benevoleModel;
