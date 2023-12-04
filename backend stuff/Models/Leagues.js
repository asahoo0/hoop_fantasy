var mongoose = require('mongoose');

// Define our user schema
var LeagueSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required:true},
    team_ids: {type:[String], default: []},
    user_ids: {type: [String], default:[]},
    join_code: {type: String, required:true},
    start: {type: Boolean, default: false}, // indicates whether all payers are done signing up and draft can begin
    draft: {type: Boolean, default: false}, // indicates whether or not draft is complete
    players: {type:[String], default:[]} // intended to keep track of all currently chosen players

}, {versionKey: false});

// Export the Mongoose model
module.exports = mongoose.model('League', LeagueSchema);