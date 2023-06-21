const router = require('express').Router();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const {
      getAllBooks,
      getOneBook,
      addNewBook,
      updateById,
} = require('../services/bookService');
const { authenticateToken } = require('../middleware/auth');
const { isOwner } = require('../middleware/guards');

const { upload, resizeImage } = require('../middleware/multer-config');
const Book = require('../models/Book');

router.get('/api/books', async (req, res) => {
      try {
            const books = await getAllBooks();
            return res.status(200).json(books);
      } catch (error) {
            return res.status(400).json({ error: error });
      }
});

router.post(
      '/api/books',
      authenticateToken,
      upload,
      resizeImage,
      async (req, res) => {
            const book = JSON.parse(req.body.book);
            delete book._id;
            delete book.ratings._id;
            delete book.ratings.userId;
            delete book.userId;

            const newBook = new Book({
                  ...book,
                  userId: req.auth.userId,
                  imageUrl: `http://localhost:4000/books/images/${req.file.path}`,
            });
            console.log('added book', newBook);
            await newBook.save();
            return res.status(201).json({ newBook });
            console.log('book', newBook);
      }
);

router.get('/api/books/bestrating', async (req, res) => {
      try {
            const books = await getAllBooks();
            const bestBooks = books.sort(function (a, b) {
                  return b.averageRating - a.averageRating;
            });
            const topBooks = [];
            const visitedBooks = new Set();
            2;

            for (const book of bestBooks) {
                  if (!visitedBooks.has(book.title)) {
                        topBooks.push(book);
                        visitedBooks.add(book.title);
                  }

                  if (topBooks.length === 3) {
                        break;
                  }
            }

            return res.status(200).json(topBooks);
      } catch (error) {
            res.status(400).json({ error: error });
      }
});

router.get('/api/books/:bookId', async (req, res) => {
      const id = req.params.bookId;
      if (!id) {
            return res.status(404).json({ message: 'Book not found' });
      }
      try {
            const book = await getOneBook(id);

            return res.status(200).json(book);
      } catch (error) {
            return res.status(400).json({ error: error });
      }
});

router.put(
      '/api/books/:bookId',
      authenticateToken,
      isOwner,
      upload,
      resizeImage,
      async (req, res) => {
            const id = req.params.bookId;
            if (!id) {
                  return res.status(404).json({ message: 'Book not found' });
            }

            try {
                  const book = await getOneBook(id);

                  let imageUrl = book.imageUrl;
                  if (req.file) {
                        imageUrl = `http://localhost:4000/books/images/${req.file.filename}`;
                  }
                  const { title, author, year, genre, ratings, averageRating } =
                        req.file ? JSON.parse(req.body.book) : req.body;
                  const bookUpdate = {
                        title,
                        author,
                        year,
                        genre,
                        ratings,
                        averageRating,
                  };
                  if (imageUrl) {
                        bookUpdate.imageUrl = imageUrl;
                  }
                  const updatedBook = await Book.findByIdAndUpdate(
                        id,
                        bookUpdate,
                        { new: true }
                  );
                  if (!updatedBook) {
                        return res
                              .status(404)
                              .json({ error: 'Book not found' });
                  }

                  return res.status(200).json({ updatedBook });
            } catch (error) {
                  res.status(400).json({ error: error });
            }
      }
);

router.delete(
      '/api/books/:bookId',
      authenticateToken,
      isOwner,
      async (req, res) => {
            const id = req.params.bookId;
            if (!id) {
                  return res.status(404).json({ message: 'Book not found' });
            }
            try {
                  const bookToDelete = await Book.findByIdAndDelete(id);
                  if (!bookToDelete) {
                        return res
                              .status(404)
                              .json({ message: 'Book not Found' });
                  }
                  return res
                        .status(200)
                        .json({ message: 'Book deleted successfully' });
            } catch (error) {
                  return res.status(500).json({ message: error.message });
            }
      }
);

router.post('/api/books/:id/rating', authenticateToken, async (req, res) => {
      const id = req.params.id;
      const { userId, rating } = req.body;
      console.log('grade from the body', req.body);

      if (rating < 0 || rating > 5) {
            return res.status(400).json({
                  message: 'Invalid rating. Rating must be between 1 and 5',
            });
            const existingRating = book.ratings.find(
                  (r) =>
                        r.userId.toString() ===
                        Types.ObjectId(userId).toString()
            );
            console.log('existing rating', existingRating);
            if (existingRating) {
                  return res.status(400).json({
                        message: 'User has already rated this book',
                  });
            }
      }
      try {
            const book = await Book.findById({ _id: id });
            console.log('book', book);
            if (!book) {
                  return res.status(404).json({ message: 'Book not found' });
            }
            // const existingRating = book.ratings.find(
            //       (r) => r.userId === userId
            // );
            // console.log('existing rating', existingRating);
            // if (existingRating) {
            //       return res.status(400).json({
            //             message: 'User has already rated this book',
            //       });
            // }

            book.ratings.push({ userId, grade: rating });
            const totalRatings = book.ratings.length;
            const sumGrades = book.ratings.reduce((acc, r) => acc + r.grade, 0);
            book.averageRating = (sumGrades / totalRatings).toFixed(1);
            const updatedBook = await book.save();
            console.log('book after save', updatedBook);
            return res.status(200).json(updatedBook);
      } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
      }
});

module.exports = router;
