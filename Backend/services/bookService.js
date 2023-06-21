const Book = require('../models/Book');

async function getAllBooks() {
      return Book.find({});
}

async function getOneBook(bookId) {
      return Book.findOne({ _id: bookId });
}

async function addNewBook(item) {
      await newBook.save();
      return newBook;
}

async function updateById(existing, item) {
      existing.title = item.title;
      existing.author = item.author;
      existing.year = item.year;
      existing.genre = item.genre;
      existing.imageUrl = item.imageUrl;
      existing.ratings = item.ratings;

      await existing.save();

      return existing;
}

module.exports = { getAllBooks, addNewBook, getOneBook, updateById };
