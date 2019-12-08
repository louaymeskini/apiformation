var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var Schema = mongoose.Schema;


var donModelSchema = new Schema({
        montant: {
            type: String,
            trim: true,
            required: true,
        },
        date: {
            type: Date,
            trim: true,
            required: true,
        },
        benevole: {
                type: Schema.Types.ObjectId, ref:"benevole"
            },
        association: {
            type: Schema.Types.ObjectId, ref:"association"
        }
    },
    {
        timestamps: true
    });

/*donModelSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
})*/

// Compile model from schema
var donModel = mongoose.model('donModel', donModelSchema );
module.exports=donModel;
