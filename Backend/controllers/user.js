const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register(req, res) {
      const { email, password } = req.body;
      const existing = await User.findOne({
            email: new RegExp(`^${email}$`, 'i'),
      });
      try {
            if(existing) {
                  return res.status(400).json({ message: 'Email already exists'})
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                  email,
                  hashedPassword,
            });

            await user.save();
            return res.status(201).json(user);
      } catch (error) {
            res.status(500).json({message: "Error registering user"});
      }
}

async function login(req, res) {
      const { email, password } = req.body;
      try {
            const user = await User.findOne({
                  email: new RegExp(`^${email}$`, 'i'),
            });
            if (!user) {
                  throw new Error('User not found');
            }
            const match = await bcrypt.compare(password, user.hashedPassword);

            if (!match) {
                  throw new Error('Incorrect email or password');
            }

            const token = generateToken(user);
            return res.status(200).json({ userId: user._id.toString(), token });
      } catch (error) {
            res.status(401).json({ message: error.message });
      }
}

function generateToken(user) {
      const payload = {
            email: user.email,
            userId: user._id.toString(),
      };

      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
      });
}

module.exports = { register, login, generateToken };
