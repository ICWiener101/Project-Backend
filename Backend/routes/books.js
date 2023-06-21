const router = require('express').Router();
const express = require('express');
const app = express();

const {
      getAllBooks,
      getOneBook,
      addNewBook,
      updateById,
      bestRatedBooks,
} = require('../controllers/book');
const { authenticateToken } = require('../middleware/auth');
const { isOwner } = require('../middleware/guards');
const { upload, resizeImage } = require('../middleware/multer-config');
const Book = require('../models/Book');

router.get('/', async (req, res) => {
      try {
            const books = await getAllBooks();
            return res.status(200).json(books);
      } catch (error) {
            return res.status(400).json({ error: error });
      }
});

router.post('/', authenticateToken, upload, resizeImage, async (req, res) => {
      try {
            const book = JSON.parse(req.body.book);
            const imagePath =
                  req.file.originalname.split('.')[0] + '.' + 'webp';
            const userId = req.auth.userId;
            const newBook = await addNewBook(book, userId, imagePath);
            return res.status(201).json({ newBook });
      } catch (error) {
            res.status(400).json({ error: error });
      }
});

router.get('/bestrating', async (req, res) => {
      try {
            const topBooks = await bestRatedBooks();
            return res.status(200).json(topBooks);
      } catch (error) {
            res.status(400).json({ error: error });
      }
});

router.get('/:bookId', async (req, res) => {
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
      '/:bookId',
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
                  const imagePath =
                        req.file.originalname.split('.')[0] + '.' + 'webp';
                  let imageUrl = book.imageUrl;
                  if (req.file) {
                        imageUrl = `http://localhost:4000/books/images/${imagePath}`;
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

router.delete('/:bookId', authenticateToken, isOwner, async (req, res) => {
      const id = req.params.bookId;
      if (!id) {
            return res.status(404).json({ message: 'Book not found' });
      }
      try {
            const bookToDelete = await Book.findByIdAndDelete(id);
            if (!bookToDelete) {
                  return res.status(404).json({ message: 'Book not Found' });
            }
            return res
                  .status(200)
                  .json({ message: 'Book deleted successfully' });
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
});

router.post('/:id/rating', authenticateToken, async (req, res) => {
      const id = req.params.id;
      const { userId, rating } = req.body;

      try {
            if (rating < 0 || rating > 5) {
                  return res.status(400).json({
                        message: 'Invalid rating. Rating must be between 1 and 5',
                  });
            }
            const book = await Book.findById({ _id: id });
            console.log('book', book);
            if (!book) {
                  return res.status(404).json({ message: 'Book not found' });
            }
            const existingRating = book.ratings.find(
                  (r) => r.userId === userId
            );

            if (existingRating) {
                  return res.status(400).json({
                        message: 'User has already rated this book',
                  });
            }

            book.ratings.push({ userId, grade: rating });
            const totalRatings = book.ratings.length;
            const sumGrades = book.ratings.reduce((acc, r) => acc + r.grade, 0);
            book.averageRating = (sumGrades / totalRatings).toFixed(1);
            const updatedBook = await book.save();

            return res.status(200).json(updatedBook);
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
});

module.exports = router;
