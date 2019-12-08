var express=require("express")
var cors=require("cors")
var fs=require("fs")
var multer=require("multer")
var bodyParser = require('body-parser')
const upload = multer({dest: __dirname + '/uploads/images'});

var admin=require("./Router/admin")
var benevole=require("./Router/benevole")
var association=require("./Router/association")
var evenement=require("./Router/evenement")
var annonce=require("./Router/annonce")
var don=require("./Router/don")
var user=require("./Router/user")

var db=require("./Models/db")
var app=express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false,limit: "50mb", parameterLimit:50000 }))
//app.use('/uploads', express.static('uploads'));  ,limit: "50mb", parameterLimit:50000
// parse application/json
app.use(bodyParser.json())
app.set('secretKey', 'louay'); // jwt secret token

app.use("/admin",admin)
app.use("/benevole",benevole)
app.use("/association",association)
app.use("/evenement",evenement)
app.use("/annonce",annonce)
app.use("/don",don)
app.use("/auth",user)



app.listen(8000,function () {
    console.log("Connected to port 8000")
})
