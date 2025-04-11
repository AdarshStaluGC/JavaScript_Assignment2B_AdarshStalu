require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

// Routes
const indexRouter = require('./routes/index');
const workoutRouter = require('./routes/workouts');
const authRouter = require('./routes/auth');

// Initialize app
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// View engine setup (Handlebars)
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Flash messages
app.use(flash());

// Passport setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash + user to views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/workouts', workoutRouter);
app.use('/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
