const multer = require('multer');
const sharp = require('sharp');

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
