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

api.post("/", (req, res) => {
    if (req.body.name && req.body.user_id && req.body.league_id) {
      teamdb.findOne({ user_id: req.body.user_id, league_id: req.body.league_id })
        .then((info) => {
          if (info) {
            res.status(400).send({ message: "A team for this user already exists within the league", data: info });
          } else {
            teamdb.create({ _id: new mongoose.Types.ObjectId(), ...req.body })
              .then((teaminfo) => {
                leaguedb.findByIdAndUpdate(req.body.league_id, { $push: { team_ids: teaminfo._id } })
                  .then(() => {
                    res.status(200).send({ message: "OK", data: teaminfo });
                  })
                  .catch(() => {
                    res.status(500).send({ message: "Server Failure occurred", data: {} });
                  });
              })
              .catch(() => {
                res.status(500).send({ message: "Server Failure occurred", data: {} });
              });
          }
        })
        .catch(() => {
          res.status(500).send({ message: "Server Failure occurred", data: {} });
        });
    } else {
      res.status(400).send({ message: "You are missing a name, user_id, or league_id", data: {} });
    }
  });

  api.get("/userTeam/:userId/:leagueId", (req, res) => {
    const { userId, leagueId } = req.params;

    teamdb.findOne({ user_id: userId, league_id: leagueId })
        .then(function (info) {
            if (info) {
                res.status(200).send({ message: "OK", data: info });
            } else {
                res.status(404).send({ message: "404 Team could not be found", data: {} });
            }
        })
        .catch(function (err) {
            res.status(500).send({ message: "Server Failure occurred", data: {} });
        });
});

api.put("/:id", (req, res) => {
    const teamId = req.params.id;
    const { players } = req.body;

    // Validate that the 'players' field is present in the request body
    if (!players || !Array.isArray(players) || players.length === 0) {
        return res.status(400).send({ message: "Invalid request body. 'players' field is required and must be a non-empty array.", data: {} });
    }

    // Find the team by ID
    teamdb.findById(teamId)
        .then((team) => {
            if (!team) {
                return res.status(404).send({ message: "Team not found", data: {} });
            }

            // Check for duplicate player IDs in the existing team
            const existingPlayers = team.players.map(player => player.toString());
            const newPlayers = players.map(player => player.toString());

            const duplicates = newPlayers.filter(player => existingPlayers.includes(player));

            if (duplicates.length > 0) {
                return res.status(400).send({ message: "Duplicate player IDs detected. Please enter unique player IDs.", data: {} });
            }

            // Update the team by adding the new players
            team.players = [...team.players, ...players];

            // Save the updated team
            team.save()
                .then(updatedTeam => {
                    return res.status(200).send({ message: "Team updated successfully", data: updatedTeam });
                })
                .catch(() => {
                    return res.status(500).send({ message: "Server Failure occurred while saving the updated team", data: {} });
                });
        })
        .catch(() => {
            return res.status(500).send({ message: "Server Failure occurred", data: {} });
        });
});

  

module.exports = api;