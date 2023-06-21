const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { register, login, generateToken } = require('../controllers/user');

router.post('/signup', async (req, res) => {
      const { email, password } = req.body;

      try {
            const user = await register(email, password);

            return res.status(201).json(user);
      } catch (error) {
            res.status(500).json(error.message);
      }
});

router.post('/login', async (req, res) => {
      const { email, password } = req.body;
      try {
            const user = await login(email, password);

            const token = generateToken(user);
            return res.status(200).json({ userId: user._id.toString(), token });
      } catch (error) {
            res.status(401).json({ message: error.message });
      }
});

module.exports = router;