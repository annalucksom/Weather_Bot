const chatController = require('../controllers/chat_controller');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('weather-query', async (query, callback) => {
      try {
        const response = await chatController.handleWeatherQuery(socket.id, query);
       
        if (typeof callback === 'function') {
          callback({ success: true, response });
        } else {
          socket.emit('weather-response', response);
        }
      } catch (error) {
        console.error('Socket error:', error);
        const errorResponse = "Sorry, I encountered an error. Please try again.";
        
        if (typeof callback === 'function') {
          callback({ success: false, error: errorResponse });
        } else {
          socket.emit('weather-error', errorResponse);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
      chatController.userSessions.delete(socket.id);
    });
  });
};
