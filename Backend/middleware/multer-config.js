const multer = require('multer');
const sharp = require('sharp');

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

const resizeImage = async (req, res, next) => {
      if (!req.file) {
            return next(); // If no file is uploaded, move to the next middleware
      }

      try {
            const imagePath = req.file.buffer; // Get the uploaded file buffer
            const name = req.file.originalname.split('.')[0]; // Get the original file name without extension
            const sharpFile = await sharp(imagePath) // Use sharp library to resize the image to a specific width and height and convert it to webp format
                  .resize({ width: 206, height: 260, fit: sharp.fit.fill })
                  .webp({ quality: 100 })
                  .toFile(`images/${name}.webp`);
      } catch (error) {
            return res.status(500).json({ message: 'Image resizing error' });
      }

      next();
};

module.exports = {
      upload,
      resizeImage,
};
