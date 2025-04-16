const weatherService = require('../services/weather_service');

exports.getCurrentWeather = async (req, res, next) => {
  try {
    const { city } = req.params;
    const weather = await weatherService.getCurrentWeather(city);
    res.json(weather);
  } catch (error) {
    next(error);
  }
};

exports.getForecast = async (req, res, next) => {
  try {
    const { city } = req.params;
    const forecast = await weatherService.getWeatherForecast(city);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
};
