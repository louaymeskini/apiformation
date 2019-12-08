var express=require("express")
var Router=express.Router()
var annonceModel = require('../Models/annonceModel')
var associationModel = require('../Models/associationModel')
var benevoleModel = require('../Models/benevoleModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fs = require("fs")
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/pieceJointe'});


//test
Router.get("/",function (req,res) {
    res.send("c bn")
})

//liste annonce
Router.get("/all", function (req, res) {
    annonceModel.find({}).populate('association').populate('benevoles').exec(function (errr, result) {
        res.send(result)
    })
})
//validateUser

// un seul annonce
Router.get("/:id", function (req,res) {
    annonceModel.findOne({_id:req.params.id}).populate('association').populate('benevoles').exec(function (err, result) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send(result);
    })
})

//trouver un benevole dans tous associations
//return liste des associations selon id de benevole bien determinee
//search by sub documents ID
Router.get("/trouver/association/:id", validateUser, function (req, res) {
    annonceModel.find({association: req.params.id}).populate('association').exec(function (errr, result) {
        if (errr)
            res.send({"state": "not ok", "msg": "err:" + errr});
        else{
            // if(isEmptyObject(result)){
            //     result=JSON.stringify({"state":"vide", "msg":"aucune inscription trouvee pour ce benevole"});
            // }
            res.send(result);
        }
    })
})

// une seule piece jointe
Router.get("/fichier/:pieceJointe", function (req, res) {
  res.sendFile(__dirname + '/uploads/pieceJointe'+req.params.pieceJointe);
})

//ajouter annonce + benevoles + association
Router.post("/ajouter",upload.single('pieceJointe'), function (req,res) {

  var file = __dirname + '/uploads/pieceJointe' + req.file.originalname;

  fs.readFile(req.file.path, function (err, data) {


    fs.writeFile(file, data, function (err) {
      if (err) {
        console.error(err);
        var response = {
          message: 'Sorry, file couldn\'t be uploaded.',
          filename: req.file.originalname
        };
      } else {
        response = {
          message: 'File uploaded successfully',
          filename: req.file.originalname
        };

    var annonce = new annonceModel({titre: req.body.titre, sujet: req.body.sujet,
        pieceJointe: req.file.originalname, association: req.body.association,
        benevoles: req.body.benevoles});

    annonce.save(function (err, data) {
        if(err){
            res.send({"state":"not ok","msg":"err:"+err});
        }
        else{
            //res.send({"state":"ok","msg":"Ajout annonce"});
          res.send(data);
        }
    })
      }
      // res.end(JSON.stringify(response));
    });
  });
})

//modification annonce + benevoles + association
Router.put("/modifier/:id",upload.single('pieceJointe'), function (req,res) {

  var file = __dirname + '/uploads/pieceJointe' + req.file.originalname;

  fs.readFile(req.file.path, function (err, data) {


    fs.writeFile(file, data, function (err) {
      if (err) {
        console.error(err);
        var response = {
          message: 'Sorry, file couldn\'t be uploaded.',
          filename: req.file.originalname
        };
      } else {
        response = {
          message: 'File uploaded successfully',
          filename: req.file.originalname
        };

    annonceModel.updateOne({_id:req.params.id},{titre: req.body.titre, sujet: req.body.sujet,
        pieceJointe: req.file.originalname, association: req.body.association,
        benevoles: req.body.benevoles}, function (err) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send({"state":"ok","msg":"update annonce:"});
    })
      }
      // res.end(JSON.stringify(response));
    });
  });
})

//supprimer annonce (angular)
Router.delete("/supprimer/:id",validateUser, function (req,res) {
    annonceModel.findOneAndDelete({_id:req.params.id}, function (err,result) {
        if(err)
        res.send({"state":"non","msg":"err:"+err});
        else {

            associationModel.findOneAndUpdate({_id: result.association}, {$pull:{annonces: req.params.id}}, function (err, resu) {
                benevoleModel.updateMany({_id: {$in: resu.benevoles}}, {$pull:{annonces: req.params.id}}, function (err, resus) {
                    res.send({"state": "ok", "msg": "supprimer annonce:"});
                })
            })
        }
    })
})

//valider l'accées pour certain interfaces
function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
        if (err) {
            res.json({status:"error", message: err.message, data:null});
        }else{
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}


//ajouter annonce angular + update benevoles annonces (angular)
Router.post("/ajouter/:idAs",validateUser,upload.single('pieceJointe'), function (req,res) {

    var file = __dirname + '/uploads/pieceJointe' + req.file.originalname;

    fs.readFile(req.file.path, function (err, data) {


        fs.writeFile(file, data, function (err) {
            if (err) {
                console.error(err);
                var response = {
                    message: 'Sorry, file couldn\'t be uploaded.',
                    filename: req.file.originalname
                };
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.file.originalname
                };

                var annonce = new annonceModel({titre: req.body.titre, sujet: req.body.sujet,
                    pieceJointe: req.file.originalname, association: req.params.idAs,
                    benevoles: req.body.benevoles});

                annonce.save(function (err, data) {
                    if(err){
                        res.send({"state":"not ok","msg":"err:"+err});
                    }
                    else{
                        associationModel.findOneAndUpdate({_id: req.params.idAs}, {$push:{annonces: annonce.id}}, function (err, resu) {
                            if (err) {
                                res.send({"state": "non", "msg": "err:" + err});
                            }
                            else {
                                // return res.send({"resu": resu.benevoles});
                                benevoleModel.updateMany({_id: {$in: resu.benevoles}}, {$push:{annonces: annonce.id}}, function (err) {})
                                res.send(data);
                            }
                        })

                    }
                })
            }
            // res.end(JSON.stringify(response));
        });
    });
})



module.exports=Router;
