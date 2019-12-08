var express = require("express")
var Router = express.Router()
var adminModel = require('../Models/adminModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

Router.get("/", function (req, res) {
    res.send("c bn")
})

Router.get("/all", function (req, res) {
    adminModel.find({}, function (err, result) {
        res.send(result);
    })
})

// une seul admin
Router.get("/:id", validateUser, function (req, res) {
    adminModel.findOne({_id: req.params.id}, function (err, result) {
        if (err)
            res.send({"state": "not ok", "msg": "err:" + err});
        else
            res.send(result);
    })
})

//register admin
Router.post("/ajouter", function (req, res) {
    var admin = new adminModel({
        nom: req.body.nom, prenom: req.body.prenom,
        email: req.body.email, username: req.body.username, password: req.body.password
    });

    admin.save(function (err) {
        if (err) {
            res.send({"state": "not ok", "msg": "err:" + err});
        }
        else {
            res.send({"state": "ok", "msg": "Ajout"});
        }
    })
})

//modifier admin
Router.put("/modifier/:id", validateUser, function (req, res) {
    adminModel.findOne({_id: req.params.id}, function (err, result) {

        if (bcrypt.compareSync(req.body.password, result.password)) {
            // return res.send("true");
            if (req.body.newPassword === req.body.confirmPassword && req.body.newPassword !=="") {

                adminModel.updateOne({_id: req.params.id}, {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.newPassword, saltRounds)
                }, function (err) {
                    if (err)
                        res.send({"state": "not ok", "msg": "err:" + err});
                    else
                        res.send({"state": "ok", "msg": "update:"});
                })
            }
            else if (req.body.newPassword !== req.body.confirmPassword){
                return res.send({"state": "not ok", "msg": "new password mismatch:"})
            }
            else {
                adminModel.updateOne({_id: req.params.id}, {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, saltRounds)
                }, function (err) {
                    if (err)
                        res.send({"state": "not ok", "msg": "err:" + err});
                    else
                        res.send({"state": "ok", "msg": "update:"});
                })
            }
        }
        else {
            res.send({"state": "not ok", "msg": "password incorrecte:"})
        }
    })

})

//supprimer administrateur
Router.delete("/supprimer/:id", function (req, res) {
    adminModel.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            res.send({"state": "non", "msg": "err:" + err});
        }
        else {
            res.send({"state": "ok", "msg": "supprimer association:"});
        }
    })
})

//adminModel.findOne({ $or: [{email: req.body.email}, {username: req.body.username}]}, function (err, userInfo) {
//authentification admin
// Router.post("/auth", function (req,res) {
//     adminModel.findOne({ $or: [{email: req.body.email}, {username: req.body.username}]}, function (err, userInfo) {
//         try {
//             if (err) {
//                 next(err);
//             }
//             else {
//                 if (bcrypt.compareSync(req.body.password, userInfo.password)) {
//                     const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});
//                     res.json({status: "success", message: "user found!!!", data: {user: userInfo, token: token}});
//                 }
//                 else {
//                     res.json({status: "error", message: "Invalid email/password!!!", data: null});
//                 }
//             }
//         }
//         catch (err) {
//             res.json({status: "error", message: "Invalid email/password!!!", data: null});
//         }
//     })
// })

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({status: "error", message: err.message, data: null});
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}


module.exports = Router;
