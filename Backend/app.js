const express = require('express');
const expressConfig = require('./config/express');
const dbConfig = require('./config/database');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

const app = express(); // Create an Express app instance

expressConfig(app); // Configure the Express app

async function initializeServer() {
      try {
            await dbConfig(app); // Connect to the database

            app.use('/books/images', express.static('images')); // Serve static files from the 'images' directory
            app.use('/api/books', booksRoutes); // Mount the books routes
            app.use('/api/auth', userRoutes); // Mount the user routes
      } catch (error) {
            console.error('Error initializing server:', error);
            process.exit(1); // Terminate the application if unable to connect to the database
      }
}
initializeServer();

module.exports = app;
