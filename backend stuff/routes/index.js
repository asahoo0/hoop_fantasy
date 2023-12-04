var teams = require("./teams");
var leagues = require("./leagues");
// var users = require("./users");
module.exports = function (app, router) {
    app.use('/teams', teams);
    app.use('/leagues', leagues);
};