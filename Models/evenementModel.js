var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var Schema = mongoose.Schema;


var evenementModelSchema = new Schema({
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
        date: {
            type: Date,
            trim: true,
            required: true,
        },
        benevoles:[
            {
                type: Schema.Types.ObjectId, ref:"benevole"
            }
        ],
        association: {
            type: Schema.Types.ObjectId, ref: "association"
        }
    },
    {
        timestamps: true
    });

/*evenementModelSchema.pre('save', function (next) {
    //this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
})*/

// Compile model from schema
var evenementModel = mongoose.model('evenementModel', evenementModelSchema );
module.exports=evenementModel;
