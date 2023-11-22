const express = require('express');
const router = express.Router();
const booksRouter = require('./books');

// Home page route
router.get('/', (req, res) => {
  res.redirect('/books');
});

// Books routes
router.use('/books', booksRouter);

module.exports = router;
