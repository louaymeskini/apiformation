var express = require("express")
var mongoose = require('mongoose')
var Router = express.Router()
var benevoleModel = require('../Models/benevoleModel')
var associationModel = require('../Models/associationModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

//test
Router.get("/", function (req, res) {
    res.send("c bn")
})

//liste benevole + associations + evenements + annonces
Router.get("/all", function (req,res) {
  benevoleModel.find({}, function (err, result) {
    res.send(result);
  })
})
/*Router.get("/all", function (req, res) {
    benevoleModel.find({}).populate('associations').populate('evenements').populate('annonces').populate('dons').exec(function (errr, result) {
        res.send(result)
        //.populate({ path: 'associations', populate: { path: 'associations' }})
    })
})*/
//validateUser

// un seul benevole
Router.get("/:id", function (req,res) {
    benevoleModel.findOne({_id:req.params.id}, function (err,result) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send(result);
    })
})

//trouver une association dans tous benevoles
Router.get("/trouver/association/:id", validateUser, function (req, res) {
    benevoleModel.find({associations: req.params.id}).exec(function (errr, result) {
        if (errr)
            res.send({"state": "not ok", "msg": "err:" + errr});
        else{
            // if(isEmptyObject(result)){
            //     result=JSON.stringify({"state":"vide", "msg":"aucune benevole trouvee pour cette association"});
            // }
            res.send(result);
        }
    })
})

// liste associations d une seul benevole
Router.get("/liste/association/:id", validateUser, function (req, res) {
  benevoleModel.find({_id: req.params.id}).select('associations').populate('associations').exec(function (errr, result) {
    if (errr)
      res.send({"state": "not ok", "msg": "err:" + errr});
    else
      res.send(result);
  })
})

// liste annonce d une seul benevole
Router.get("/liste/annonce/:id", validateUser, function (req, res) {
  benevoleModel.find({_id: req.params.id}).select('annonces').populate('annonces').exec(function (errr, result) {
    if (errr)
      res.send({"state": "not ok", "msg": "err:" + errr});
    else
      res.send(result);
  })
})

// liste evenement d une seul benevole
Router.get("/liste/evenement/:id", validateUser, function (req, res) {
  benevoleModel.find({_id: req.params.id}).select('evenements').populate({path:'evenements', populate:{path:'association'}}).exec(function (errr, result) {
    if (errr)
      res.send({"state": "not ok", "msg": "err:" + errr});
    else
      res.send(result);
  })
})

//inscription benevole +
Router.post("/ajouter", function (req, res) {
    var benevole = new benevoleModel({
        nom: req.body.nom, prenom: req.body.prenom,
        sexe: req.body.sexe, ville: req.body.ville, adresse: req.body.adresse,
        codePostale: req.body.codePostale, tel: req.body.tel,
        email: req.body.email, username: req.body.username, password: req.body.password,
        associations: req.body.associations, evenements: req.body.evenements,
        annonces: req.body.annonces ,dons: req.body.dons
    });
    /*associationModel.findOne({_id: this.benevole.association}).exec((error, associationModel) => {
        associationModel.benevole.push(benevole);
        item.save(()=>{next();});
    associationModel.save();
        });*/
    benevole.save(function (err) {
        if (err) {
            res.send({"state": "not ok", "msg": "err:" + err});
        }
        else {
            res.send({"state": "ok", "msg": "Ajout benevole"});
        }
    })
})

//modification benevole + associations + evenements + annonces
Router.put("/modifier/:id",validateUser, function (req, res) {
    var benevole = benevoleModel.updateOne({_id: req.params.id}, {
        nom: req.body.nom, prenom: req.body.prenom,
        sexe: req.body.sexe, ville: req.body.ville, adresse: req.body.adresse,
        codePostale: req.body.codePostale, tel: req.body.tel,
        email: req.body.email, username: req.body.username, password: bcrypt.hashSync(req.body.password,saltRounds)}, function (err) {
        if (err)
            res.send({"state": "not ok", "msg": "err:" + err});
        else
            res.send({"state": "ok", "msg": "update:"});
    })

    /*associationModel.findOne({_id: this.benevole.association}).exec((error, associationModel) => {
        associationModel.benevole.push(benevole);
    //item.save(()=>{next();});
    associationModel.save();
});*/

})

//mise a jour de l'association du benevole GRRRRR
Router.patch("/modifier/association/:id",validateUser, function (req,res) {
      benevoleModel.updateOne({_id: req.params.id}, {
        nom: req.body.nom, prenom: req.body.prenom,
        sexe: req.body.sexe, ville: req.body.ville, adresse: req.body.adresse,
        codePostale: req.body.codePostale, tel: req.body.tel,
        email: req.body.email, username: req.body.username, password: req.body.password,
        associations: req.body.associations, evenements: req.body.evenements,
        annonces: req.body.annonces}, function (err) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send({"state":"ok","msg":"update association du benevole:"});
    })

})

//supprimer benevole (angular)
Router.delete("/supprimer/:id",validateUser, function (req, res) {
    associationModel.updateMany({benevoles : {$in: req.params.id}}, {$pull:{benevoles: req.params.id}}, function (err) {})
    benevoleModel.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            res.send({"state": "non", "msg": "err:" + err});
        }
        else {
            res.send({"state": "ok", "msg": "supprimer association:"});
        }
    })
})

//delete inscription association (angular)
Router.put("/supprimer/:id/association/:idA",validateUser, function (req, res) {
  benevoleModel.findOneAndUpdate({_id: req.params.id}, {$pull:{associations: req.params.idA}}, function (err,resu) {
    if (err) {
      res.send({"state": "non", "msg": "err:" + err});
    }
    else {
        associationModel.findOneAndUpdate({_id: req.params.idA}, {$pull:{benevoles: req.params.id}}, function (err,result) {
            if (err) {
                res.send({"state": "non", "msg": "err:" + err});
            } else {
                for (var x in result.annonces){
                    resu.annonces.splice(resu.annonces.indexOf(x),1)

                }
                 // return res.send(resu.annonces);
                benevoleModel.findOneAndUpdate({_id: req.params.id}, {annonces: resu.annonces}, function (err,resu) {})
                //associationModel.save();
                res.send({"state": "ok", "msg": "supprimer inscription association, supprimer benevole membre:"});
            }
        })
    }
  })
})

//add inscription association
Router.put("/ajouter/:id/association/:idA",validateUser, function (req, res) {
  benevoleModel.updateOne({_id: req.params.id}, {$push:{associations: req.params.idA}}, function (err) {
    //associationModel.benevoles.pull({_id: req.params.id}, function (err) {
    if (err) {
      res.send({"state": "non", "msg": "err:" + err});
    }
    else {
      //associationModel.save();
      res.send({"state": "ok", "msg": "ajouter inscription association:"});
    }
  })
})

//delete annonce of benevole
Router.put("/supprimer/:id/annonce/:idA",validateUser, function (req, res) {
  benevoleModel.updateOne({_id: req.params.id}, {$pull:{annonces: req.params.idA}}, function (err) {
    if (err) {
      res.send({"state": "non", "msg": "err:" + err});
    }
    else {
      res.send({"state": "ok", "msg": "supprimer annonce du benevole:"});
    }
  })
})

//add annonce of benevole
Router.put("/ajouter/:id/annonce/:idA",validateUser, function (req, res) {
  benevoleModel.updateOne({_id: req.params.id}, {$push:{annonces: req.params.idA}}, function (err) {
    if (err) {
      res.send({"state": "non", "msg": "err:" + err});
    }
    else {
      res.send({"state": "ok", "msg": "ajouter annonce du benevole"});
    }
  })
})

//delete evenement of benevole
Router.put("/supprimer/:id/evenement/:idE",validateUser, function (req, res) {
  benevoleModel.updateOne({_id: req.params.id}, {$pull:{evenements: req.params.idE}}, function (err) {
    if (err) {
      res.send({"state": "non", "msg": "err:" + err});
    }
    else {
      res.send({"state": "ok", "msg": "supprimer evenement du benevole:"});
    }
  })
})

//add evenement of benevole
Router.put("/ajouter/:id/evenement/:idE",validateUser, function (req, res) {
  benevoleModel.updateOne({_id: req.params.id}, {$push:{evenements: req.params.idE}}, function (err) {
    if (err) {
      res.send({"state": "non", "msg": "err:" + err});
    }
    else {
      res.send({"state": "ok", "msg": "ajouter evenement du benevole"});
    }
  })
})

//authentification benevole
Router.post("/auth", function (req, res) {
    benevoleModel.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}, function (err, userInfo) {
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

//valider l'accées pour certain interfaces
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

//check if res if empty
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}


module.exports = Router;
