const mongoose = require('mongoose');
const Book = require('../models/Book');

const dbName = 'books';

const connectionString = `mongodb://127.0.0.1:27017/${dbName}`;

module.exports = async (app) => {
      try {
            await mongoose.connect(connectionString, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
            });

            console.log('Database connected');

            mongoose.connection.on('error', (err) => {
                  console.error('Database error');
                  console.error(err);
            });
      } catch (err) {
            console.error('Error connecting to database', err);
            process.exit(1);
      }
};
