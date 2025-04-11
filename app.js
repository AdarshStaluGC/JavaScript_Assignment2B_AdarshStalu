// Load environment variables from .env
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

// Route files
const indexRouter = require('./routes/index');
const workoutRouter = require('./routes/workouts');
const authRouter = require('./routes/auth');

// Create Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Set up Handlebars view engine
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
app.set('view engine', 'hbs');

// Body parser & static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Flash messages
app.use(flash());

// Initialize Passport (for auth)
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global variables for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/', indexRouter);
app.use('/workouts', workoutRouter);
app.use('/auth', authRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
