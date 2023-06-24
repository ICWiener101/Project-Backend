const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { register, login, generateToken } = require('../controllers/user');

router.post('/signup', register);
router.post('/login', login);

module.exports = router;
