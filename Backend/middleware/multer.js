const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage for handling file uploads
// Filter function to check if the uploaded file is an image
const filter = (req, file, callback) => {
      if (file.mimetype.split('/')[0] === 'image') {
            callback(null, true); // Accept the file if it's an image
      } else {
            callback(new Error('Only images allowed')); // Reject the file if it's not an image
      }
};

const upload = multer({ storage: storage, fileFilter: filter }).single('image'); // Single file upload middleware, accepting only images

module.exports = {
      upload,
};
