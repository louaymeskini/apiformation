var express=require("express")
var Router=express.Router()
var userModel = require('../Models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

//get all
Router.get("/all", function (req, res) {
  userModel.find({}, function (errr, result) {
    if (errr)
      next(errr);
    else
      res.send(result)
  })
})

//authentification all
Router.post("/", function (req,res) {
  userModel.findOne({ $or: [{email: req.body.email}, {username: req.body.username}]}, function (err, userInfo) {
    try {
      if (err) {
        next(err);
      }
      else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});
          res.json({status: "success", message: "user found!!!", data: {user: userInfo, token: token}});
        }
        else {
          res.json({status: "error", message: "Invalid email/password!!!", data: null});
        }
      }
    }
    catch (err) {
      res.json({status: "error", message: "Invalid email/password!!!", data: null});
    }
  })
})

module.exports=Router;
