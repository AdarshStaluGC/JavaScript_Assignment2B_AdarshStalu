const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  exercise: String,
  duration: Number,
  notes: String
});

module.exports = mongoose.model('Workout', WorkoutSchema);
