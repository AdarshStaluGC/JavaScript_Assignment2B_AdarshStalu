const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  githubId: { type: String },
  password: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
