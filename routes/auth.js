// Import required modules
const express = require('express');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Route to display registration form
router.get('/register', (req, res) => res.render('register'));

// Route to handle user registration form submission
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before saving to the database for security
  const hash = await bcryptjs.hash(password, 10);

  // Create a new user with the hashed password
  await User.create({ username, password: hash });

  // Flash a success message and redirect to login page
  req.flash('success_msg', 'Registered successfully');
  res.redirect('/auth/login');
});

// Route to display login form
router.get('/login', (req, res) => res.render('login'));

// Route to handle login form submission using Passport local strategy
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/workouts',    // Redirect to workouts on success
    failureRedirect: '/auth/login',  // Redirect back to login on failure
    failureFlash: true               // Enable flash messages on failure
  })
);

// GitHub login route, initiates GitHub OAuth flow
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback route
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/workouts')  // Redirect to workouts after successful login
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    // Flash a logout success message and redirect to homepage
    req.flash('success_msg', 'Logged out');
    res.redirect('/');
  });
});

// Export the router so it can be used in the main app
module.exports = router;
