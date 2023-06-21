const express = require('express');
const expressConfig = require('./config/express');
const dbConfig = require('./config/database');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

start();
async function start() {
      const app = express();
      expressConfig(app);
      await dbConfig(app);
      app.use('/books/images', express.static('images'));
      app.use('/api/books', booksRoutes);
      app.use('/api/auth', userRoutes);

      app.listen(4000, () => console.log('Server is running on port 4000'));
}
