const express     = require('express'),
      router      = express.Router(),
      Recipe      = require('../models/recipe'),
      User        = require('../models/user'),
      passport    = require('passport');
      // Middleware - authentication


// ========================
// Recipe Routes
// ========================

router.get('/', (req, res) => {
  res.redirect('/mealapp/recipes');
});

router.get('/recipes', (req, res) => {
  let pageNo = req.query.p || 1;
  let lastId = req.query.last || '';

  if (pageNo <= 1) {
    Recipe.find({}).limit(9)
    .exec((err, foundRecipes) => {
      if (err) {
        console.log(err);
        req.flash('error', `Unable to fetch recipes. Sorry about that. Error: ${err}`);
        res.redirect('/mealapp')
      } else {
        res.render('mealApp/indexes/index', { recipes: foundRecipes, pageNum: pageNo });
      }
    });
  } else {
    let numSkip = 9 * (pageNo - 1)
    Recipe.find({}).skip(numSkip).limit(9)
    .exec((err, foundRecipes) => {
      if (err) {
        console.log(err);
        req.flash('error', `Unable to fetch recipes. Sorry about that. Error: ${err}`);
        res.redirect('/')
      } else {
        res.render('mealApp/indexes/index', { recipes: foundRecipes, pageNum: pageNo });
      }
    });
  };
});

router.get('/recipes/search', (req, res) => {
  res.send('This is the search page');
});

router.get('/recipes/random', (req, res) => {
  res.send('This is the random page');
});

router.get('/recipes/categories/:category', (req, res) => {
  res.send(`This is the ${req.params.category} page.`);
});

router.get('/recipes/new', (req, res) => {
  res.send('This is the new recipe form page');
});

router.post('/recipes', (req, res) => {
  res.send('This is the new recipe POST page');
});

router.get('/recipes/:id', (req, res) => {
  res.send(`This is the show page for recipe with id of ${req.params.id} page`);
});

router.get('/recipes/:id/edit', (req, res) => {
  res.send(`This is the edit form page for recipe id of ${req.params.id}`);
});

router.put('/recipes/:id', (req, res) => {
  res.send(`This is the recipe update PUT for id of ${req.params.id}`);
});

router.delete('/recipes/:id', (req, res) => {
  res.send(`This is the DELETE for id ${req.params.id}`)
});

router.get('/cart', (req, res) => {
  res.send('This is my cart');
});

// ========================
// Authentication Routes
// ========================

router.get('/register', (req, res) => {
  res.render('mealApp/register');
});

router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect('back')
    }
    res.redirect('/mealapp/recipes');
  })
});

router.get('/login', (req, res) => {
  res.render('mealapp/login');
});

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/mealapp/recipes',
    failureRedirect: '/login'
  }
));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/mealapp/recipes');
});

module.exports = router;
