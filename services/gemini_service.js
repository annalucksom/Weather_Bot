const axios = require('axios');
const config = require('../config');
const createError = require('http-errors');

class GeminiService {
  constructor() {
    this.conversationHistory = [];
  }

  async generateResponse(prompt, weatherData = null) {
    try {
      const systemMessage = {
        role: "user",
        parts: [{
          text: `
        You are **WeatherGPT**, a vibrant and friendly weather assistant powered by OpenWeather data. 🌤️  
        Your role is to provide concise, helpful, and well-decorated responses using **markdown format** with **emojis** and **text styling**.
        
        ---
        
        ### 🌦️ In your **first response**, always include:
        - 📍 **Location** name
        - 🌡️ **Temperature** and _feels like_ condition
        - 🌧️ **Weather description** (e.g., clear, cloudy, rain)
        - 💧 **Humidity level**
        - 🌬️ **Wind speed**
        - 🧳 A quick _outfit suggestion_ or _weather-based tip_ (based on current data)
        
        👉 End with a warm, engaging question like:  
        > _"Want a packing tip or outfit suggestion for today?"_
        
        ---
        
        ### 🧾 Format & Behavior Rules:
        - ✅ Always use **markdown format**
        - 🎨 Include **emojis** and **text decorations** (e.g., _italic_, **bold**)
        - 😄 Maintain a **friendly and helpful tone**
        - 🛰️ Stick to **data available from the OpenWeather API**
        - 🔒 Do **not** include forecasts or comparisons unless OpenWeather provides it
        
        ---
        
        You're here to make weather info fun, accurate, and beautifully presented! ☀️🌧️🌈
        `
        }]
      };

      const weatherContext = weatherData ? this._formatWeatherContext(weatherData) : null;
      const messages = [systemMessage, ...this.conversationHistory];

      if (weatherContext) {
        messages.push({
          role: "user",
          parts: [{ text: `Current Weather Data:\n${weatherContext}` }]
        });
      }

      messages.push({
        role: "user",
        parts: [{ text: `User query: ${prompt}` }]
      });

      const response = await axios.post(
        `${config.GEMINI_URL}?key=${config.GEMINI_API_KEY}`,
        {
          contents: messages,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1200,
            topP: 0.9
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        throw new Error('Invalid response structure from Gemini API');
      }

      this._updateConversationHistory(prompt, aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Gemini API error:', {
        request: error.config?.data,
        response: error.response?.data,
        stack: error.stack
      });
      throw createError.InternalServerError('I encountered an issue processing your request. Please try again.');
    }
  }

  _formatWeatherContext(weatherData) {
    return JSON.stringify(weatherData, null, 2)
      .replace(/"/g, "'") 
      .replace(/\n/g, '\n\n'); 
  }

  _updateConversationHistory(userInput, aiResponse) {
    if (this.conversationHistory.length >= 6) {
      this.conversationHistory = this.conversationHistory.slice(2);
    }

    this.conversationHistory.push(
      {
        role: "user",
        parts: [{ text: userInput }]
      },
      {
        role: "model",
        parts: [{ text: aiResponse }]
      }
    );
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = new GeminiService();
