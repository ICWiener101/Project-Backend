const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
      'image/jpg': 'jpg',
      'image/jpeg': 'jpg',
      'image/png': 'png',
};

const storage = multer.diskStorage({
      destination: (req, file, callback) => {
            callback(null, 'images');
      },
      filename: (req, file, callback) => {
            const name = file.originalname.split('-').join('_').split('.')[0];
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + Date.now() + '.' + extension);
      },
});

const upload = multer({ storage: storage }).single('image');

const resizeImage = async (req, res, next) => {
      if (!req.file) {
            return next();
      }

      try {
            const imagePath = req.file.path;
            const resizedImagePath = imagePath.replace(/\.\w+$/, '.webP');
            await sharp(imagePath)
                  .resize(206, 260, { fill: 'contain' })
                  .toFile(resizedImagePath);

            req.file.path = resizedImagePath.split('\\')[1];
            console.log('Uploaded file:', req.file);
            console.log('Resized file:', req.file.path);
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
