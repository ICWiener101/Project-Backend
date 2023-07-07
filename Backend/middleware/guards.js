const Book = require('../models/Book');

async function isOwner(req, res, next) {
      // Extract the bookId from the request parameters
      const { bookId } = req.params;
      // Extract the userId from the authenticated user information
      const { userId } = req.auth;

      try {
            // Find the book by its ID
            const book = await Book.findOne({ _id: bookId });

            // If the book is not found, return a 404 Not Found response
            if (!book) {
                  return res.status(404).json({ message: 'Book not found' });
            }
            // Check if the userId of the book matches the authenticated userId
            if (book.userId.toString() !== userId) {
                  return res
                        .status(403)
                        .json({ message: 'Unauthorized access' });
            }
            // Move to the next middleware or route handler
            next();
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
}

module.exports = { isOwner };
