const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather_controller');

router.get('/weather/current/:city', weatherController.getCurrentWeather);
router.get('/weather/forecast/:city', weatherController.getForecast);

router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

module.exports = router;
