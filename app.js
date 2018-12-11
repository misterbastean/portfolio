const express             = require('express'),
      app                 = express(),
      mongoose            = require('mongoose'),
      bodyParser          = require('body-parser'),
      methodOverride      = require('method-override'),
      passport            = require('passport'),
      config              = require('./config'),
      User                = require('./models/user'),
      LocalStrategy       = require('passport-local'),
      flash               = require('connect-flash');

// Route imports
const teslaRoutes   = require('./routes/tesla');
const mealAppRoutes  = require('./routes/recipes');

// MethodOverride config
app.use(methodOverride('_method'));

// Mongoose setup and config
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.database.username}:${config.database.password}@${config.database.url}`);

// Body Parser setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setup view engine
app.set('view engine', 'ejs');

// Authentication
app.use(require('express-session')({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass currentUser to each page
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // res.locals.error = req.flash('error');
  // res.locals.success = req.flash('success');
  next();
});

// Serve public folder
app.use('/public', express.static(__dirname + '/public'));

// Use routes
app.use('/tesla', teslaRoutes);
app.use('/mealApp', mealAppRoutes);


// Listening
app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Portfolio server is running");
})
