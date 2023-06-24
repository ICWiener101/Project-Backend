const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
      'image/jpg': 'jpg',
      'image/jpeg': 'jpg',
      'image/png': 'png',
};

const storage = multer.memoryStorage();
const filter = (req, file, callback) => {
      if (file.mimetype.split('/')[0] === 'image') {
            callback(null, true);
      } else {
            callback(new Error('Only images allowed'));
      }
};

const upload = multer({ storage: storage, fileFilter: filter }).single('image');

const resizeImage = async (req, res, next) => {
      if (!req.file) {
            return next();
      }

      try {
            const imagePath = req.file.buffer;
            const name = req.file.originalname.split('.')[0];
            const sharpFile = await sharp(imagePath)
                  .resize(206, 260, { fill: 'contain' })
                  .webp({ quality: 100 })
                  .toFile(`images/${name}.webp`);
      } catch (error) {
            console.error('Image resizing error:', error);
      }

      next();
};

module.exports = {
      upload,
      resizeImage,
};
