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

            console.log('Uploaded file:', req.file);
            console.log('Resized file:', sharpFile);
      } catch (error) {
            // Handle any errors that occur during image resizing
            console.error('Image resizing error:', error);
      }

      next();
};

module.exports = {
      upload,
      resizeImage,
};
// destination: (req, file, callback) => {
//       callback(null, 'images');
// },
// filename: (req, file, callback) => {
//       const name = file.originalname.split('-').join('_').split('.')[0];
//       const extension = MIME_TYPES[file.mimetype];
//       callback(null, name + Date.now() + '.' + extension);
// },
