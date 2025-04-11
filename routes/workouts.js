const express = require("express");
const Workout = require("../models/Workout");
const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

// List
router.get("/", ensureAuth, async (req, res) => {
  const keyword = req.query.q;
  const query = { user: req.user._id };
  if (keyword) {
    query.exercise = { $regex: keyword, $options: "i" };
  }
  const workouts = await Workout.find(query).sort({ date: -1 });
  res.render("workouts/list", { workouts, keyword });
});

// Add
router.get("/add", ensureAuth, (req, res) => res.render("workouts/add"));

router.post("/add", ensureAuth, async (req, res) => {
  await Workout.create({ ...req.body, user: req.user._id });
  res.redirect("/workouts");
});

// Edit
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const workout = await Workout.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  res.render("workouts/edit", { workout });
});

router.post("/edit/:id", ensureAuth, async (req, res) => {
  await Workout.updateOne({ _id: req.params.id, user: req.user._id }, req.body);
  res.redirect("/workouts");
});

// Delete
router.post("/delete/:id", ensureAuth, async (req, res) => {
  await Workout.deleteOne({ _id: req.params.id, user: req.user._id });
  res.redirect("/workouts");
});

module.exports = router;
