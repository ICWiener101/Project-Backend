const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
      try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (blacklist.has(token)) {
                  return res.status(403).json({ message: 'Invalid token' });
            }
            const decodedToken = jwt.verify(
                  token,
                  process.env.ACCESS_TOKEN_SECRET
            );
            req.auth = {
                  userId: decodedToken.userId,
            };
            next();
      } catch (error) {
            return res.status(401).json({ message: 'User Not Logged in ' });
      }
}

module.exports = { authenticateToken };
