require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5001,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '34f5d9f52d17d59d5c6fc1e5dc89804b',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyBNf0hB4v4xqP3OchY973imgXOL9QprnpE',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    NODE_ENV: process.env.NODE_ENV || 'development',
    GEMINI_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'
};
