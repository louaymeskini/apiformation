var express=require("express")
var Router=express.Router()
var donModel = require('../Models/donModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//test
Router.get("/",function (req,res) {
    res.send("c bn")
})

//liste don
Router.get("/all", function (req, res) {
    donModel.find({}).populate('association').populate('benevoles').exec(function (errr, result) {
        res.send(result)
    })
})
//validateUser

// un seul don
Router.get("/:id", function (req,res) {
    donModel.findOne({_id:req.params.id}, function (err,result) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send(result);
    })
})

//ajouter don + benevoles + association
Router.post("/ajouter", function (req,res) {
    var don = new donModel({montant: req.body.montant, date: req.body.date,
        benevoles: req.body.benevoles, association: req.body.association});
    don.save(function (err) {
        if(err){
            res.send({"state":"not ok","msg":"err:"+err});
        }
        else{
            res.send({"state":"ok","msg":"Ajout don"});
        }
    })
})

//modification don + benevoles + association ++ useless++
Router.put("/modifier/:id", function (req,res) {
    donModel.updateOne({_id:req.params.id},{montant: req.body.montant, date: req.body.date}, function (err) {
        if(err)
            res.send({"state":"not ok","msg":"err:"+err});
        else
            res.send({"state":"ok","msg":"update don:"});
    })

})

//supprimer don ++ useless++
Router.delete("/supprimer/:id", function (req,res) {
    donModel.deleteOne({_id:req.params.id}, function (err) {
        if(err)
        {res.send({"state":"non","msg":"err:"+err});}
        else
        {res.send({"state":"ok","msg":"supprimer don:"});}
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



module.exports=Router;
