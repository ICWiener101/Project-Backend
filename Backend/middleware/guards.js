const { getOneBook } = require('../controllers/book');
async function isOwner(req, res, next) {
      const { bookId } = req.params;
      const { userId } = req.auth;

      try {
            const book = await getOneBook(bookId);

            if (!book) {
                  return res.status(404).json({ message: 'Book not found' });
            }

            if (book.userId.toString() !== userId) {
                  return res
                        .status(403)
                        .json({ message: 'Unauthorized access' });
            }

            next();
      } catch (error) {
            return res.status(500).json({ message: error.message });
      }
}

module.exports = { isOwner };
