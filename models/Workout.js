// Importing Mongoose to define schema and interact with MongoDB
const mongoose = require('mongoose');

// Defining a schema for the Workout model
const WorkoutSchema = new mongoose.Schema({
  // Reference to the user who created the workout (linked to User model)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Date of the workout, defaults to current date and time
  date: { type: Date, default: Date.now },

  // Name or type of the exercise performed
  exercise: String,

  // Duration of the workout in minutes (or another unit)
  duration: Number,

  // Optional notes about the workout
  notes: String
});

// Exporting the Workout model so it can be used throughout the app
module.exports = mongoose.model('Workout', WorkoutSchema);
