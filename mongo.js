const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

const Blog = require('./models/blog');

const url = `mongodb+srv://${config.DB_USER}:${config.DB_PASS}@${config.TEST_DB_URL}`;

mongoose.set('strictQuery', false);

logger.info('connecting to', url);

mongoose
  .connect(url)
  .then((result) => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

const blog = new Blog({
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
});

blog.save().then((result) => {
  console.log('note saved!');
  mongoose.connection.close();
});
