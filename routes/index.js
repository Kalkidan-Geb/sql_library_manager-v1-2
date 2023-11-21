const express = require('express');
const router = express.Router();
const booksRouter = require('./books');

// Home page route
router.get('/', (req, res) => {
  res.render('index', { title: 'Library' });
});

// Books routes
router.use('/books', booksRouter);

module.exports = router;
