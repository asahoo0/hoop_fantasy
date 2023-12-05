var teamdb = require("../Models/Teams");
var leaguedb = require("../Models/Leagues");
var express = require("express");
var api = express.Router();
var mongoose = require("mongoose");

api.get("/:id", (req, res)=> {
    leaguedb.findOne({_id: req.params.id})
        .then(function (info) {
            if (info) {
                res.status(200).send({message: "OK", data: info});
            } else {
                res.status(404).send({message: "404 League could not be found", data: {}});
            }
        })
        .catch(function (err) {
            res.status(404).send({message: "404 League could not be found", data: {}});
        })
});

api.post("/", async (req, res)=> {
    if (req.body.name && req.body.join_code) {
        var exsistingLeague = await leaguedb.findOne({name: req.body.name})
        if (exsistingLeague != null) {
            res.status(400).send({message: "This league already exsist", data: exsistingLeague});
        } else {
            var newLeague = await leaguedb.create({_id: new mongoose.Types.ObjectId, ...req.body})
                .catch((err) => {res.status(500).send({message: "Server Failure occured1", data:{}});});
                res.status(202).send({message: "League Created", data: newLeague});
        } 
    } else {
        res.status(400).send({message: "you are missing a name or join code", data:{}});
    }
});

api.put("/:id", async (req, res) => {
    var exsistingLeague = await leaguedb.findOne({_id: req.params.id})
        .catch((err) => {
            res.status(500).send({message: "Server Failure occured", data:{}});
        });
    if (exsistingLeague) {
        var updatedaLeague = await leaguedb.findOneAndUpdate({_id : req.params.id}, {...req.body})
            .catch((err) => {res.status(500).send({message: "Server Failure occured", data:{}});});
        res.status(202).send({message: "Updated League", data: updatedaLeague});
    } else {
        res.status(400).send({message: "This league does't exsist", data: {}});
    }
});

module.exports = api;