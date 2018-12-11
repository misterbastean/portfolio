const express     = require('express'),
      router      = express.Router();


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/portfolio', (req, res) => {
  res.render('portfolio');
});

module.exports = router;
