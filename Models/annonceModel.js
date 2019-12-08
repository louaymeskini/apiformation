var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var Schema = mongoose.Schema;


var annonceModelSchema = new Schema({
        titre: {
            type: String,
            trim: true,
            required: true,
        },
        sujet: {
            type: String,
            trim: true,
            required: true,
        },
        pieceJointe: {
            type: String,
            trim: true,
            required: true,
        },
        association: {
            type: Schema.Types.ObjectId, ref: "association"
        },
        benevoles:[
            {
                type: Schema.Types.ObjectId, ref:"benevole"
            }
        ]
    },
    {
        timestamps: true
    });

/*annonceModelSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
})*/

// Compile model from schema
var annonceModel = mongoose.model('annonceModel', annonceModelSchema );
module.exports=annonceModel;
