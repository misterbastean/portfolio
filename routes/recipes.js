const express     = require('express'),
      router      = express.Router(),
      Recipe      = require('../models/recipe'),
      User        = require('../models/user'),
      passport    = require('passport');
      // Middleware - authentication


// ========================
// Recipe Routes
// ========================

// Landing - currently redirecting to index
router.get('/', (req, res) => {
  res.redirect('/mealapp/recipes');
});

// Index
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

// Search
router.get('/recipes/search', (req, res) => {
  Recipe.find({$text:
    {
      $search: req.query.term
    }
  })
  .exec((err, foundRecipes) => {
    if (err) {
      console.log(err);
      req.flash('error', `Unable to fetch recipes. Sorry about that. Error: ${err}`);
      res.redirect('/mealapp/recipes');
    } else {
      res.render('mealApp/indexes/search', { recipes: foundRecipes });
    };
  });
});

// Random
router.get('/recipes/random', (req, res) => {
  Recipe.aggregate([{
    '$sample': {
      'size': 1
    }
  }])
  .exec((err, foundRecipe) => {
    if (err) {
      console.log(err);
      req.flash('error', `Unable to fetch random recipe. Sorry about that. Error: ${err}`);
      res.redirect('/mealapp/recipes');
    } else {
      res.redirect(`/mealapp/recipes/${foundRecipe[0]._id}`)
    }
  })
});

// Categories
router.get('/recipes/categories/:category', (req, res) => {
  Recipe.find({protein: req.params.category}, (err, foundRecipes) => {
    if (err) {
      console.log(err);
      req.flash('error', `Unable to fetch category. Sorry about that. Error: ${err}`);
      res.redirect('back')
    } else {
      res.render('mealapp/indexes/categories', { recipes: foundRecipes });
    }
  })
});

// Show new form
router.get('/recipes/new', (req, res) => {
  res.render('mealapp/newRecipe');
});

// Add recipe to DB
router.post('/recipes', (req, res) => {
  // Set correct imageUrl
  let imageUrl;
  if (!!req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  } else {
    imageUrl = 'https://via.placeholder.com/150';
  }

  // Create ingredients object
  let ingredients = [];
  req.body.ingredients.forEach((ingredient) => {
    ingredients.push({
      ingredientName: `${ingredient.ingredientName} ${ingredient.ingredientUnit}`,
      ingredientQuantity: parseInt(ingredient.ingredientQuantity)
    });
  });
  console.log(ingredients);

  // Build recipe object
  const newRecipe = {
    recipeName: req.body.recipeName,
    protein: req.body.protein,
    ingredients: ingredients,
    directions: req.body.directions,
    imageUrl,
    description: req.body.description,
    prepMinutes: req.body.prepMinutes,
    cookMinutes: req.body.cookMinutes,
    servingNumber: req.body.servingNumber
  };

  // Push new recipe to database
  Recipe.create(newRecipe, (err, recipe) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Unable to add recipe.');
      res.redirect('back');
    } else {
      console.log('Recipe added');
      req.flash('success', 'Recipe Added!');
      console.log(recipe);
      res.redirect('recipes');
    }
  })
});

// Show
router.get('/recipes/:id', (req, res) => {
  Recipe.findById(req.params.id, (err, foundRecipe) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Unable to find recipe with that ID.')
      res.redirect('/mealapp/recipes');
    } else {
      res.render('mealapp/showRecipe', { recipe: foundRecipe });
    };
  })
});

// Show edit form
router.get('/recipes/:id/edit', (req, res) => {
  res.send(`This is the edit form page for recipe id of ${req.params.id}`);
});

// Update recipe in DB
router.put('/recipes/:id', (req, res) => {
  res.send(`This is the recipe update PUT for id of ${req.params.id}`);
});

// Delete
router.delete('/recipes/:id', (req, res) => {
  Recipe.findByIdAndDelete(req.params.id, (err, removedRecipe) => {
    if (err) {
      console.log(err);
      req.flash('error', `Unable to delete recipe. Sorry about that. Error: ${err}`);
      res.redirect('/mealapp/recipes');
    } else {
      req.flash('success', 'Recipe deleted successfully!');
      res.redirect('/mealapp/recipes');
    }
  })
});

// Cart
router.get('/cart', (req, res) => {
  res.render('mealapp/cart');
});

// ========================
// Authentication Routes
// ========================

// Show register form
router.get('/register', (req, res) => {
  res.render('mealApp/register');
});

// Add new user
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

// Show login form
router.get('/login', (req, res) => {
  res.render('mealapp/login');
});

// Log user in
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/mealapp/recipes',
    failureRedirect: '/login'
  }
));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/mealapp/recipes');
});

module.exports = router;
