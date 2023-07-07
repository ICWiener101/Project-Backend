const mongoose = require('mongoose');
const Book = require('../models/Book');

const dbName = 'books'; // Name of the MongoDB database

const connectionString = `mongodb://127.0.0.1:27017/${dbName}`; // MongoDB connection URL

module.exports = async (app) => {
      try {
            // Connect to the MongoDB database using the provided connection string
            await mongoose.connect(connectionString, {
                  useNewUrlParser: true, // Use new URL parser
                  useUnifiedTopology: true, // Use new server discovery and monitoring engine
            });

            console.log('Database connected');
            // Handle database connection errors
            mongoose.connection.on('error', (err) => {
                  console.error('Database error');
                  console.error(err);
            });
      } catch (err) {
            console.error('Error connecting to database', err);
            process.exit(1); // Terminate the application if unable to connect to the database
      }
};
