var express = require('express');
var router = express.Router();

// Get a list of all lights
router.get('/', function(req, res, next) {
  let response = req.app.get('hardware').philipsHue.getLights();
  res.json(response);
});

/**
 * Get a specific light
 */
router.get('/:id/', function(req, res, next) {
  let response = req.app.get('hardware').philipsHue.getLight(req.params.id);

  if (!response) {
    res.status(400).json();
  } else {
    res.json(response);
  }
});

/**
 * Set a specific light
 */
router.get('/:id/set', function(req, res, next) {
  const state = {
    on: req.query.on,
    brightness: req.query.brightness,
    hue: req.query.hue,
    saturation: req.query.saturation,
    effect: req.query.effect,
    colorTemperature: req.query.colorTemperature
  }
  
  req.app.get('hardware').philipsHue.setLight(req.params.id, state).then(() => {
    res.json();
  }).fail(error => {
    res.status(500).json({message: error.message});
  });
});

module.exports = router;
