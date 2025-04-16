require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const createError = require('http-errors');
const config = require('./config');
const apiRoutes = require('./routes/api_routes');
const socketRoutes = require('./routes/socket_routes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();
const httpServer = createServer(app);

app.use(morgan('dev'));
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

app.use('/api', apiRoutes);
socketRoutes(io);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorHandler);

httpServer.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
  console.log(`🌐 Environment: ${config.NODE_ENV}`);
});
