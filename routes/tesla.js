const express =     require('express'),
      router  =     express.Router();


router.get('/', (req, res) => {
  res.render('tesla/index');
});

module.exports = router;
