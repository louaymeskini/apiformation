//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
//var mongoDB = 'mongodb://db:27017/backend';
var mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/backend';
// mongoose.connect(mongoDB, { useNewUrlParser: true });
// // Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;
// //Get the default connection
// var db = mongoose.connection;
//
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connect(mongoDB, {
    useNewUrlParser: true
})
    .then(db => console.log(`DB is connected`))
    .catch(err => console.error(err));
