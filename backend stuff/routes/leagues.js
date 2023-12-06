const express = require("express");
const api = express.Router();
const mongoose = require("mongoose");
const leaguedb = require("../Models/Leagues");

api.get("/:id", async (req, res) => {
    try {
        const info = await leaguedb.findOne({ _id: req.params.id });
        if (info) {
            res.status(200).json({ message: "OK", data: info });
        } else {
            res.status(404).json({ message: "404 League could not be found", data: {} });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", data: {} });
    }
});

api.post("/", async (req, res) => {
    try {
        if (req.body.name && req.body.join_code) {
            const existingLeague = await leaguedb.findOne({ name: req.body.name });
            if (existingLeague) {
                res.status(400).json({ message: "This league already exists", data: existingLeague });
            } else {
                const newLeague = await leaguedb.create({ _id: new mongoose.Types.ObjectId(), ...req.body });
                res.status(201).json({ message: "League Created", data: newLeague });
            }
        } else {
            res.status(400).json({ message: "You are missing a name or join code", data: {} });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", data: {} });
    }
});

api.put("/:id", async (req, res) => {
    try {
        console.log(`Received PUT request for league ID: ${req.params.id}`);
        
        const existingLeague = await leaguedb.findOne({ _id: req.params.id });

        if (existingLeague) {
            console.log('League found:', existingLeague);

            const updatedLeague = await leaguedb.findOneAndUpdate({ _id: req.params.id }, { ...req.body });
            console.log('Updated league:', updatedLeague);

            res.status(200).json({ message: "Updated League", data: updatedLeague });
        } else {
            console.log('League not found.');
            res.status(404).json({ message: "This league doesn't exist", data: {} });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: "Internal Server Error", data: {} });
    }
});


api.get("/getLeagueId/:joinCode", async (req, res) => {
    try {
      const { joinCode } = req.params;
  
      console.log(`Received request for join code: ${joinCode}`);
  
      // Lookup the league based on the join code
      const existingLeague = await leaguedb.findOne({ join_code: joinCode });
  
      console.log('Existing league:', existingLeague);
  
      if (!existingLeague) {
        console.log('League not found.');
        return res.status(404).json({ message: "League not found", data: {} });
      }
  
      // Return the league ID
      console.log('League found. ID:', existingLeague._id);
      return res.status(200).json({ message: "League found", data: { leagueId: existingLeague._id } });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: "Internal Server Error", data: {} });
    }
  });
  // Add a new endpoint to specifically handle adding a user ID to a league
api.put("/:id/addUser", async (req, res) => {
    try {
        console.log(`Received PUT request to add user to league ID: ${req.params.id}`);
        
        const existingLeague = await leaguedb.findOne({ _id: req.params.id });

        if (existingLeague) {
            console.log('League found:', existingLeague);

            // Extract the user ID from the request body
            const { user_id } = req.body;

            // Check if the user ID already exists in the array
            if (existingLeague.user_ids.includes(user_id)) {
                console.log('User ID already exists in the array.');
                return res.status(400).json({ message: "User ID already exists in the array", data: {} });
            }

            // Update the user_ids array
            const updatedLeague = await leaguedb.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { user_ids: user_id } },
                { new: true } // Return the updated document
            );
            console.log('Updated league:', updatedLeague);

            res.status(200).json({ message: "User added to the league", data: updatedLeague });
        } else {
            console.log('League not found.');
            res.status(404).json({ message: "This league doesn't exist", data: {} });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: "Internal Server Error", data: {} });
    }
});
api.get("/userLeagues/:userUID", async (req, res) => {
    try {
      const { userUID } = req.params;
  
      // Find leagues where the user is a participant
      const userLeagues = await leaguedb.find({ user_ids: userUID });
  
      res.status(200).json(userLeagues);
    } catch (error) {
      console.error('Error fetching user leagues:', error);
      res.status(500).json({ message: "Internal Server Error", data: {} });
    }
  });
  


module.exports = api;
