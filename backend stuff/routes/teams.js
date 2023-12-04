var teamdb = require("../Models/Teams");
var leaguedb = require("../Models/Leagues");
var express = require("express");
var api = express.Router();
var mongoose = require("mongoose");

api.get("/:id", (req, res)=> {
    teamdb.findOne({_id: req.params.id})
        .then(function (info) {
            if (info) {
                res.status(200).send({message: "OK", data: info});
            } else {
                res.status(404).send({message: "404 User could not be found", data: {}});
            }
        })
        .catch(function (err) {
            res.status(404).send({message: "404 User could not be found", data: {}});
        })
});

api.post("/", (req, res)=> {
    if (req.body.name && req.body.user_id && req.body.league_id) {
        teamdb.findOne({user_id: req.body.user_id, league_id: req.body.league_id})
            .then((info) => {
                if (info.length) {
                    res.status(400).send({message: "A team for this user already exists within the league", data: info});
                } else {
                    teamdb.create({_id: new mongoose.Types.ObjectId, ...req.body})
                        .then((teaminfo) => {
                            leaguedb.findByIdAndUpdate(req.body.league_id, {$push: {team_ids: teaminfo._id}})
                                .then((err) => {res.status(200).send({message: "OK", data: teaminfo});})
                                .catch((err) => {res.status(500).send({message: "Server Failure occured", data:{}});});
                        })
                }
            })
            .catch((err) => {
                res.status(500).send({message: "Server Failure occured", data:{}});
            });
    } else {
        res.status(400).send({message: "you are missing a name, user_id, or league_id", data:{}});
    }
});

module.exports = api;