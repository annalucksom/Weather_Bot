const axios = require('axios');
const config = require('../config');
const createError = require('http-errors');

class WeatherService {
  async getCurrentWeather(city) {
    try {
      if (!city || typeof city !== 'string') {
        throw createError.BadRequest('Invalid city name');
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.OPENWEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw createError.NotFound(`City "${city}" not found`);
      }
      throw createError.InternalServerError('Weather service unavailable');
    }
  }

  async getWeatherForecast(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${config.OPENWEATHER_API_KEY}&units=metric`;
      const response = await axios.get(url);
      console.log(response.data);
      
      return response.data.list.map(item => ({
        dt: item.dt,
        date: new Date(item.dt * 1000),
        weather: item.weather[0].main,
        description: item.weather[0].description,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        icon: item.weather[0].icon
      }));
    } catch (error) {
      throw createError.InternalServerError('Failed to get weather forecast');
    }
  }
}

module.exports = new WeatherService();
