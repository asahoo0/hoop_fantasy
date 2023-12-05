// Get the packages we need
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    // secrets = require('./config/secrets'),
    bodyParser = require('body-parser');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// Connect to a MongoDB --> Uncomment this once you have a connection string!!
mongoose.connect("mongodb+srv://admin:helloill@thecluster.xc0c7jt.mongodb.net/?retryWrites=true&w=majority"); // possibly need to remove useUnifiedTopology arg

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use routes as a module (see index.js)
require('./routes')(app, router);
const leaguesRouter = require('./routes/leagues')
const teamsRouter = require('./routes/teams')
app.use('/api/leagues',leaguesRouter)
app.use('/api/teams',teamsRouter)

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
