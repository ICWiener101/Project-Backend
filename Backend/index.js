const express = require('express');
const expressConfig = require('./config/express');
const databaseConfig = require('./config/database');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const path = require('path');

const app = express(); // Create an instance of the Express application

expressConfig(app); // Configure the Express application

async function initializeServer() {
      try {
            await databaseConfig(app); // Connect to the database

            app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve static files from the 'images' directory
            app.use('/api/books', booksRoutes); // Mount the routes for books
            app.use('/api/auth', userRoutes); // Mount the routes for users
      } catch (error) {
            console.error('Error initializing server:', error);
            process.exit(1); // Terminate the application if unable to connect to the database
      }
}

initializeServer();

const port = process.env.PORT || 4000; // Set the port number

app.listen(port, () => {
      console.log(`Server is running on port ${port}`); // Start the server and display the port it's listening on
});
