var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var Schema = mongoose.Schema;


var userModelSchema = new Schema({
    email: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    }
  },
  {
    discriminatorKey: 'type',
    timestamps: true
  });

userModelSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
})

// Compile model from schema
var userModel = mongoose.model('userModel', userModelSchema );
module.exports=userModel;
