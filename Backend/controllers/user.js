const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register(req, res) {
      // Extract email and password from request body
      const { email, password } = req.body;
      // Check if a user with the same email already exists
      const existing = await User.findOne({
            email: new RegExp(`^${email}$`, 'i'), // Case-insensitive search for email
      });
      try {
            // If a user with the same email exists, return a 400 Bad Request response
            if (existing) {
                  return res
                        .status(400)
                        .json({ message: 'Email already exists' });
            }
            // Hash the password using bcrypt with a salt of 10 rounds
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new user with the email and hashed password
            const user = new User({
                  email,
                  hashedPassword,
            });

            // Save the user to the database
            await user.save();
            // Return a 201 Created response with the user object
            return res.status(201).json(user);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
}

async function login(req, res) {
      // Extract email and password from request body
      const { email, password } = req.body;
      try {
            // Find the user with the provided email
            const user = await User.findOne({
                  email: new RegExp(`^${email}$`, 'i'), // Case-insensitive search for email
            });
            // If no user is found, return a 404 Not Found response
            if (!user) {
                  return res.status(404).json({ message: 'User not found' });
            }
            // Compare the provided password with the hashed password stored in the user object
            const match = await bcrypt.compare(password, user.hashedPassword);
            // If the passwords don't match, return a 400 Bad Request respons
            if (!match) {
                  return res
                        .status(400)
                        .json({ message: 'Incorrect email or password' });
            }
            // Generate a token for the user
            const token = generateToken(user);
            // Return a 200 OK response with the user ID and token
            return res.status(200).json({ userId: user._id.toString(), token });
      } catch (error) {
            res.status(401).json({ message: error.message });
      }
}

function generateToken(user) {
      // Create a payload containing the user's email and user ID
      const payload = {
            email: user.email,
            userId: user._id.toString(),
      };
      // Sign the payload with a secret key to generate the token
      // expiresIn specifies the token expiration time
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
      });
}

module.exports = { register, login, generateToken };
