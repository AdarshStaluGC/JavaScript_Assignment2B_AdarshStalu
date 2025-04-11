// Importing required modules and dependencies
const LocalStrategy = require('passport-local').Strategy; // For local username/password authentication
const GitHubStrategy = require('passport-github2').Strategy; // For GitHub OAuth authentication
const bcryptjs = require('bcryptjs'); // For password hashing and comparison
const User = require('../models/User'); // Importing the User model

module.exports = function (passport) {
  // Local Strategy for username and password login
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by username in the database
      const user = await User.findOne({ username });

      // If user does not exist, authentication fails
      if (!user) return done(null, false, { message: 'User not found' });

      // If user exists but has no password (e.g., signed up with GitHub), fail login
      if (!user.password) return done(null, false, { message: 'Use GitHub login' });

      // Compare entered password with the stored hashed password
      const isMatch = await bcryptjs.compare(password, user.password);

      // If password matches, login succeeds; otherwise, fail
      return isMatch ? done(null, user) : done(null, false, { message: 'Wrong password' });
    } catch (err) {
      // In case of any server error during the process
      return done(err);
    }
  }));

  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, // GitHub App Client ID (from .env)
    clientSecret: process.env.GITHUB_CLIENT_SECRET, // GitHub App Client Secret (from .env)
    callbackURL: process.env.GITHUB_CALLBACK // Redirect URI after GitHub login
  }, async (accessToken, refreshToken, profile, done) => {
    // Check if a user already exists with this GitHub ID
    let user = await User.findOne({ githubId: profile.id });

    // If not found, create a new user using GitHub profile info
    if (!user) {
      user = await User.create({ githubId: profile.id, username: profile.username });
    }

    // Complete the authentication process
    return done(null, user);
  }));

  // Serialize user ID into session
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserialize user from session using ID
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id); // Fetch the full user object from the database
    done(null, user);
  });
};
