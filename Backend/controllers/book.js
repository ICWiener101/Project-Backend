const Book = require('../models/Book');
const fs = require('fs');

async function getAllBooks(req, res) {
      try {
            const books = await Book.find({});
            return res.status(200).json(books);
      } catch (error) {
            return res.status(400).json({ error: error });
      }
}

async function getOneBook(req, res) {
      const id = req.params.bookId;

      try {
            const book = await Book.findOne({ _id: id });
            if (!book) {
                  return res.status(404).json({ message: 'Book not found' });
            }
            return res.status(200).json(book);
      } catch (error) {
            return res.status(404).json({ error: error });
      }
}

async function addNewBook(req, res) {
      try {
            const book = JSON.parse(req.body.book);

            // Generating the image path based on the original file name
            const imagePath =
                  req.file.originalname.split('.')[0] + '.' + 'webp';
            // Retrieving the userId from the authenticated request
            const userId = req.auth.userId;
            // Deleting unnecessary properties from the book object
            delete book._id;
            delete book.ratings._id;
            delete book.ratings.userId;
            delete book.userId;
            // Creating a new Book instance with the modified book object and other necessary properties
            const newBook = new Book({
                  ...book,
                  userId: userId,
                  imageUrl: `http://localhost:4000/books/images/${imagePath}`,
            });
            await newBook.save();
            return res.status(201).json({ newBook });
      } catch (error) {
            res.status(400).json({ error: error });
      }
}

async function updateBook(req, res) {
      const { bookId } = req.params;
      // Check if the bookId parameter is provided
      if (!bookId) {
            return res.status(404).json({ message: 'Book not found' });
      }

      try {
            // Find the book in the database based on the bookId
            const book = await Book.findOne({ _id: bookId });
            let imageUrl = book.imageUrl;
            // Check if a new image file is uploaded
            if (req.file) {
                  // Delete the old image file
                  const oldImagePath = book.imageUrl.split('/').pop(); // Extract the old image file name from the imageUrl
                  fs.unlink(`images/${oldImagePath}`, (err) => {
                        if (err) {
                              console.error(
                                    'Error deleting old image file:',
                                    err
                              );
                        }
                  });
                  const imagePath =
                        req.file.originalname.split('.')[0] + '.' + 'webp';
                  imageUrl = `http://localhost:4000/books/images/${imagePath}`;
            }
            // Extract the book details from the request body
            const { title, author, year, genre } = req.body;
            const bookUpdate = {
                  title,
                  author,
                  year,
                  genre,
            };
            // Update the imageUrl field if a new image is uploaded
            if (imageUrl) {
                  bookUpdate.imageUrl = imageUrl;
            }
            // Update and retrieve the updated book document
            const updatedBook = await Book.findByIdAndUpdate(
                  bookId,
                  bookUpdate,
                  {
                        new: true, // option in mongoose that returns the updated document as the result of findByIdAndUpdate()
                  }
            );
            // Check if the book document was not found
            if (!updatedBook) {
                  return res.status(404).json({ error: 'Book not found' });
            }
            // Return the updated book document as the response
            return res.status(200).json(updatedBook);
      } catch (error) {
            // Handle any errors that occurred during the update process
            res.status(500).json({ error: error });
      }
}

async function bestRatedBooks(req, res) {
      // try {
      //       const books = await Book.find({});
      //       //Create an empty array to store the top-rated books
      //       const topBooks = [];
      //       // Create a set to keep track of visited books by their title
      //       const visitedBooks = new Set();
      //       2;
      //       // Sort the books in descending order based on averageRating
      //       const bestBooks = books.sort(function (a, b) {
      //             return b.averageRating - a.averageRating;
      //       });

      //       // Iterate through the sorted books and add them to the topBooks array
      //       for (const book of bestBooks) {
      //             // Check if the book has not been visited yet
      //             if (!visitedBooks.has(book.title)) {
      //                   topBooks.push(book);
      //                   visitedBooks.add(book.title);
      //             }
      //             // Break the loop if the desired number of top books has been reached
      //             if (topBooks.length === 3) {
      //                   break;
      //             }
      //       }

      //       return res.status(200).json(topBooks);
      // } catch (error) {
      //       res.status(400).json({ error: error });
      // }
      //server sorting version
      try {
            const topBooks = await Book.find({})
                  .sort({ averageRating: -1 })
                  .limit(3);

            return res.status(200).json(topBooks);
      } catch (error) {
            res.status(400).json({ error: error });
      }
}

async function deleteBook(req, res) {
      // Extract the bookId from the request parameters
      const id = req.params.bookId;
      // Check if bookId is missing
      if (!id) {
            return res.status(404).json({ message: 'Book not found' });
      }
      try {
            // Find and delete the book by its id using Book.findByIdAndDelete()
            const bookToDelete = await Book.findByIdAndDelete(id);
            // Check if the book was not found
            if (!bookToDelete) {
                  return res.status(404).json({ message: 'Book not Found' });
            }
            // Delete the associated image file
            const imagePath = bookToDelete.imageUrl.split('/').pop(); // Extract the image file name from the imageUrl
            fs.unlink(`images/${imagePath}`, (err) => {
                  if (err) {
                        console.error('Error deleting image file:', err);
                  }
            });
            return res
                  .status(200)
                  .json({ message: 'Book deleted successfully' });
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
}

async function rateBook(req, res) {
      const id = req.params.bookId;
      const { userId, rating } = req.body;
      if (userId !== req.auth.userId) {
            return res.status(401).json({ message: 'Unauthorized access' });
      }
      try {
            // Validate rating range
            if (rating < 1 || rating > 5) {
                  return res.status(400).json({
                        message: 'Invalid rating. Rating must be between 1 and 5',
                  });
            }
            // Find the book by its ID
            const book = await Book.findById(id);
            // Check if the book exists
            if (!book) {
                  return res.status(404).json({ message: 'Book not found' });
            }
            // Check if the user has already rated the book
            const existingRating = book.ratings.find(
                  (r) => r.userId === userId
            );
            if (existingRating) {
                  return res.status(400).json({
                        message: 'User has already rated this book',
                  });
            }
            // Add the new rating to the book's ratings array
            book.ratings.push({ userId, grade: rating });
            // Calculate the new average rating
            const totalRatings = book.ratings.length;
            const sumGrades = book.ratings.reduce((acc, r) => acc + r.grade, 0);
            book.averageRating = (sumGrades / totalRatings).toFixed(1);
            // Save the updated book
            const updatedBook = await book.save();

            return res.status(200).json(updatedBook);
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
}

module.exports = {
      getAllBooks,
      addNewBook,
      getOneBook,
      updateBook,
      bestRatedBooks,
      deleteBook,
      rateBook,
};
