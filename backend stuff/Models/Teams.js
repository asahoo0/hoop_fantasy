var mongoose = require('mongoose');

// Define our user schema
var TeamSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required:true},
    user_id: {type:String, required:true},
    league_id: {type:String, required: true},
    players: {type:[Number], default:[]},
    score: {type: Number, default: 0}
}, {versionKey: false});

// Export the Mongoose model
module.exports = mongoose.model('Team', TeamSchema);