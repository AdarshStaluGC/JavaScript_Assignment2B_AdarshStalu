const express = require('express');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcryptjs.hash(password, 10);
  await User.create({ username, password: hash });
  req.flash('success_msg', 'Registered successfully');
  res.redirect('/auth/login');
});

// Login
router.get('/login', (req, res) => res.render('login'));

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/workouts',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

// GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/workouts')
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'Logged out');
    res.redirect('/');
  });
});

module.exports = router;
