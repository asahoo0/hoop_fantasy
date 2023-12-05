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
        const existingLeague = await leaguedb.findOne({ _id: req.params.id });
        if (existingLeague) {
            const updatedLeague = await leaguedb.findOneAndUpdate({ _id: req.params.id }, { ...req.body });
            res.status(200).json({ message: "Updated League", data: updatedLeague });
        } else {
            res.status(404).json({ message: "This league doesn't exist", data: {} });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", data: {} });
    }
});

module.exports = api;
