// Import express and the Workout model
const express = require("express");
const Workout = require("../models/Workout");
const router = express.Router();

// Middleware to ensure user is authenticated before accessing certain routes
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next(); // Proceed if user is authenticated
  res.redirect("/auth/login"); // Redirect to login page if not authenticated
}

// List workouts (with optional search)
router.get("/", ensureAuth, async (req, res) => {
  const keyword = req.query.q; // Get search keyword from query parameters
  const query = { user: req.user._id }; // Ensure workouts belong to the logged-in user
  if (keyword) {
    // If keyword is provided, filter workouts by exercise name using a case-insensitive match
    query.exercise = { $regex: keyword, $options: "i" };
  }
  const workouts = await Workout.find(query).sort({ date: -1 }); // Fetch and sort workouts by date (newest first)
  res.render("workouts/list", { workouts, keyword }); // Render the workout list view with the results
});

// Render form to add a new workout
router.get("/add", ensureAuth, (req, res) => res.render("workouts/add"));

// Handle submission of new workout
router.post("/add", ensureAuth, async (req, res) => {
  // Create a new workout entry with the form data and logged-in user's ID
  await Workout.create({ ...req.body, user: req.user._id });
  res.redirect("/workouts"); // Redirect to workout list after adding
});

// Render form to edit an existing workout
router.get("/edit/:id", ensureAuth, async (req, res) => {
  // Find the specific workout to be edited, ensuring it belongs to the logged-in user
  const workout = await Workout.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  res.render("workouts/edit", { workout }); // Render the edit form with the workout data
});

// Handle update of workout details
router.post("/edit/:id", ensureAuth, async (req, res) => {
  // Update the workout with the submitted data
  await Workout.updateOne({ _id: req.params.id, user: req.user._id }, req.body);
  res.redirect("/workouts"); // Redirect to workout list after editing
});

// Handle deletion of a workout
router.post("/delete/:id", ensureAuth, async (req, res) => {
  // Delete the workout if it belongs to the logged-in user
  await Workout.deleteOne({ _id: req.params.id, user: req.user._id });
  res.redirect("/workouts"); // Redirect to workout list after deletion
});

// Export the router to be used in app.js
module.exports = router;
