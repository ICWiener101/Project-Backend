const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
      try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedToken = jwt.verify(
                  token,
                  process.env.ACCESS_TOKEN_SECRET
            );
            req.auth = {
                  userId: decodedToken.userId,
            };
            next();
      } catch (error) {
            return res.status(401).json({ message: error.message });
      }
}

module.exports = { authenticateToken };
