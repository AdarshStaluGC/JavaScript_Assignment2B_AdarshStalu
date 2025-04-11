const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
  // Local
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'User not found' });
      if (!user.password) return done(null, false, { message: 'Use GitHub login' });

      const isMatch = await bcryptjs.compare(password, user.password);
      return isMatch ? done(null, user) : done(null, false, { message: 'Wrong password' });
    } catch (err) {
      return done(err);
    }
  }));

  // GitHub
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
  }, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = await User.create({ githubId: profile.id, username: profile.username });
    }
    return done(null, user);
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
