const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// GET /books - (displays the full library of books)
router.get('/', asyncHandler(async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('index', { title: 'Library', books });
  } catch (error) {
    next(error);
  }
}));

// GET /books/new - (displays the create new book form)
router.get('/new', (req, res, next) => {
  res.render('new-book', { title: 'New Book', errors: [] });
});

// POST /books/new - (posts a new book to the database)
router.post('/new', asyncHandler(async (req, res, next) => {
 /* const { title, author } = req.body;

  if (!title && !author) {
    const errors = ['Title and Author are required'];
    res.render('new-book', { title: 'New Book', errors });
    return; // Prevent further execution of the route if both fields are empty
  }

  if (!title) {
    const errors = ['Title is required'];
    res.render('new-book', { title: 'New Book', errors });
    return; // Prevent further execution of the route if title is empty
  }

  if (!author) {
    const errors = ['Author is required'];
    res.render('new-book', { title: 'New Book', errors });
    return; // Prevent further execution of the route if author is empty
  } ()
*/
  try {
    const book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      res.render('new-book', { title: 'New Book', errors });
    } else {
      next(error);
    }
  }
}));

// GET /books/:id (shows book detail form)
router.get('/:id', asyncHandler(async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { title: 'Update Book', book });
    } else {
      next();
      // used to pass to 404 handler
    }
  } catch (error) {
    next(error);
  }
}));

// POST /books/:id - (updates book information in the database)
router.post('/:id', asyncHandler(async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      next();
      // also used to pass to 404 handler
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      // Do not include errors as a property on book
      res.render('update-book', { title: 'Update Book', book, errors });
    } else {
      next(error);
    }
  }
}));

// POST /books/:id/delete (used to delete a book)
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      next();
      // used to pass to 404 handler again
    }
  } catch (error) {
    next(error);
  }
}));

module.exports = router;