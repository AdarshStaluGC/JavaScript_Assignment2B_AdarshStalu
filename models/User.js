// Importing Mongoose to define the schema and interact with MongoDB
const mongoose = require('mongoose');

// Creating a new schema for the User model
const UserSchema = new mongoose.Schema({
  // Username is required and must be unique
  username: { type: String, required: true, unique: true },

  // GitHub ID is optional; used if the user logs in via GitHub
  githubId: { type: String },

  // Password is optional; only required for local login (not used for GitHub login)
  password: { type: String }
});

// Exporting the User model so it can be used in other parts of the application
module.exports = mongoose.model('User', UserSchema);
