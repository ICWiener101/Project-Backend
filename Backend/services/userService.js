const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register(email, password) {
      const existing = await User.findOne({
            email: new RegExp(`^${email}$`, 'i'),
      });

      if (existing) {
            return res.status(409).json({ message: 'Already registered' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
            email,
            hashedPassword,
      });
      await user.save();
      return user;
}
async function login(email, password) {
      const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
      if (!user) {
            throw new Error('User not found');
      }
      const match = await bcrypt.compare(password, user.hashedPassword);

      if (!match) {
            throw new Error('Incorrect email or password');
      }
      return user;
}

function generateToken(user) {
      const payload = {
            email: user.email,
            userId: user._id.toString(),
      };

      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = { register, login, generateToken };
