const express             = require('express'),
      app                 = express(),
      mongoose            = require('mongoose'),
      bodyParser          = require('body-parser'),
      methodOverride      = require('method-override'),
      passport            = require('passport'),
      config              = require('./config');


// Route imports
const teslaRoutes   = require('./routes/tesla');
const mealAppRoutes  = require('./routes/recipes');


// Mongoose setup and config
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.database.username}:${config.database.password}@${config.database.url}`);

// Body Parser setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setup view engine
app.set('view engine', 'ejs');

// Serve public folder
app.use('/public', express.static(__dirname + '/public'));


// Use routes
app.use('/tesla', teslaRoutes);
app.use('/mealApp', mealAppRoutes);


// Listening
app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Portfolio server is running");
})
