const Book = require('../models/Book');

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
      if (!id) {
            return res.status(404).json({ message: 'Book not found' });
      }
      try {
            const book = await Book.findOne({ _id: id });

            return res.status(200).json(book);
      } catch (error) {
            return res.status(400).json({ error: error });
      }
}
async function addNewBook(req, res) {
      try {
            const book = JSON.parse(req.body.book);
            const imagePath =
                  req.file.originalname.split('.')[0] + '.' + 'webp';
            const userId = req.auth.userId;
            delete book._id;
            delete book.ratings._id;
            delete book.ratings.userId;
            delete book.userId;
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
            const updatedBook = await Book.findByIdAndUpdate(id, bookUpdate, {
                  new: true,
            });
            if (!updatedBook) {
                  return res.status(404).json({ error: 'Book not found' });
            }

            return res.status(200).json({ updatedBook });
      } catch (error) {
            res.status(400).json({ error: error });
      }
}

async function bestRatedBooks(req, res) {
      try {
            const books = await Book.find({});
            const topBooks = [];
            const visitedBooks = new Set();
            2;
            const bestBooks = books.sort(function (a, b) {
                  return b.averageRating - a.averageRating;
            });
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
}

async function deleteBook(req, res) {
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
}

async function rateBook(req, res) {
      const id = req.params.id;
      const { userId, rating } = req.body;

      try {
            if (rating < 0 || rating > 5) {
                  return res.status(400).json({
                        message: 'Invalid rating. Rating must be between 1 and 5',
                  });
            }

            const book = await Book.findById(id);

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
