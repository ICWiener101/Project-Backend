const router = require('express').Router();
const express = require('express');
const app = express();
const {
      getAllBooks,
      getOneBook,
      addNewBook,
      updateBook,
      bestRatedBooks,
      deleteBook,
      rateBook,
} = require('../controllers/book');
const { authenticateToken } = require('../middleware/auth');
const { isOwner } = require('../middleware/guards');
const { upload, resizeImage } = require('../middleware/multer-config');
const Book = require('../models/Book');

router.get('/', getAllBooks);
router.post('/', authenticateToken, upload, resizeImage, addNewBook);
router.get('/bestrating', bestRatedBooks);
router.get('/:bookId', getOneBook);
router.put(
      '/:bookId',
      authenticateToken,
      isOwner,
      upload,
      resizeImage,
      updateBook
);
router.post('/:bookId/rating', authenticateToken, rateBook);
router.delete('/:bookId', authenticateToken, isOwner, deleteBook);

module.exports = router;
