const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
      try {
            // Extract the token from the 'authorization' header
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            // Verify the token using the secret key
            const decodedToken = jwt.verify(
                  token,
                  process.env.ACCESS_TOKEN_SECRET
            );
            // Attach the decoded user ID to the request object for future use
            req.auth = {
                  userId: decodedToken.userId,
            };
            next();
      } catch (error) {
            return res.status(401).json({ message: 'User Not Logged in ' });
      }
}

module.exports = { authenticateToken };
