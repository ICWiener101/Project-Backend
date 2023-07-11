const sharp = require('sharp');
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

module.exports = { resizeImage };
