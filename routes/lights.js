var express = require('express');
var router = express.Router();

// Get a list of all lights
router.get('/', function(req, res, next) {
  res.json(req.app.get('hardware').philipsHue.getLights());
});

module.exports = router;
