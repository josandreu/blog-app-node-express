const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    try {
      const decodeToken = jwt.verify(request.token, process.env.SECRET);

      if (!decodeToken.id) {
        return response.status(401).json({
          error: 'token invalid',
        });
      }
      const user = await User.findById(decodeToken.id);

      if (user) {
        request.user = user;
      }
    } catch (error) {
      next(error);
    }
  }

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
