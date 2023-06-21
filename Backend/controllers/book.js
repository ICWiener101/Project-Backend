const Book = require('../models/Book');

async function getAllBooks() {
      return Book.find({});
}

async function getOneBook(bookId) {
      return Book.findOne({ _id: bookId });
}

async function addNewBook(book, userId, imagePath) {
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

      return newBook;
}

async function updateById(existing, item) {
      await existing.save();

      return existing;
}

async function bestRatedBooks() {
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
      return topBooks;
}

module.exports = {
      getAllBooks,
      addNewBook,
      getOneBook,
      updateById,
      bestRatedBooks,
};
