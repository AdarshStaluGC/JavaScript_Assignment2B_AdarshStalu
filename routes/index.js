// Import express module
const express = require('express');

// Create a new router object
const router = express.Router();

// Route for the homepage
router.get('/', (req, res) => {
  // Render the 'index' view when the root URL is accessed
  res.render('index');
});

// Export the router so it can be used in other parts of the app
module.exports = router;
