var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var user= require("./userModel")

var Schema = mongoose.Schema;


var associationModelSchema = user.discriminator("association", new Schema({
      imageAssociation:{
        type: String,
        required: true,
      },
      nom: {
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
        benevoles:[
            {
                type: Schema.Types.ObjectId, ref:"benevole"
            }
        ],
        annonces:[
            {
                type: Schema.Types.ObjectId, ref:"annonceModel"
            }
        ],
        evenements:[
            {
                type: Schema.Types.ObjectId, ref:"evenementModel"
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
var associationModel = mongoose.model('association');
module.exports=associationModel;
