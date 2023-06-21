const {
      Schema,
      model,
      Types: { ObjectId },
} = require('mongoose');

const bookSchema = new Schema({
      userId: { type: ObjectId, ref: 'User', required: true },
      title: { type: String, required: true },
      author: { type: String, required: true },
      imageUrl: { type: String, required: true },
      year: { type: Number, required: true },
      genre: { type: String, required: true },
      ratings: [
            {
                  userId: { type: ObjectId, ref: 'User', required: false },
                  grade: { type: Number, required: false },
            },
      ],
      averageRating: { type: Number, required: true },
});

bookSchema.path('title').validate(function (value) {
      return value.length <= 20;
}, 'Title must not exceed 100 characters.');

bookSchema.path('year').validate(function (value) {
      const currentYear = new Date().getFullYear();
      return value >= 1800 && value <= currentYear;
}, 'Invalid year.');

const Book = model('Book', bookSchema);

module.exports = Book;
