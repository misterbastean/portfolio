// TODO:
// 1. Update cursor on cart page to make recipes at top more obviously links to users


const express             = require('express'),
      app                 = express(),
      mongoose            = require('mongoose'),
      bodyParser          = require('body-parser'),
      methodOverride      = require('method-override'),
      passport            = require('passport'),
      User                = require('./models/user'),
      LocalStrategy       = require('passport-local'),
      flash               = require('connect-flash'),
      path                = require('path');

      // Only import config if working locally.
      let config;
      try {
        config            = require('./config')
      } catch (e) {
        console.log("config was not imported. This probably means you are not working locally.");
        console.log(e);
      }


// Route imports
const teslaRoutes   = require('./routes/tesla');
const mealAppRoutes = require('./routes/recipes');
const indexRoutes   = require('./routes/index');
const techRoutes    = require('./routes/techInfusion');

// MethodOverride config
app.use(methodOverride('_method'));

// Mongoose setup and config
mongoose.Promise = global.Promise;
try {
  mongoose.connect(`mongodb://${config.database.username}:${config.database.password}@${config.database.url}`, {useNewUrlParser: true});

} catch(e) {
  mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`, {useNewUrlParser: true});
}

// Body Parser setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setup view engine
app.set('view engine', 'ejs');

// Authentication
try {
  app.use(require('express-session')({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
  }));
} catch(e) {
  app.use(require('express-session')({
    secret: process.env.ES_SECRET,
    resave: false,
    saveUninitialized: false
  }));
}


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect-Flash setup
app.use(flash());

// Middleware to pass currentUser and Flash to each page
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Serve public folder and views folder
app.use('/public', express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname, 'views'));

// Use routes
app.use('/tesla', teslaRoutes);
app.use('/mealApp', mealAppRoutes);
app.use('/techInfusion', techRoutes);
app.use('/', indexRoutes);


// Listening
app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Portfolio server is running");
})
