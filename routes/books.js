const express = require('express');
const router = express.Router();
const { Book } = require('../models');

// GET /books - (displays the full library of books)
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('index', { title: 'Library', books });
  } catch (error) {
    next(error);
  }
});

// GET /books/new - (displays the create new book form)
router.get('/new', (req, res) => {
  res.render('new-book', { title: 'New Book', book: {} });
});

// POST /books/new - (posts a new book to the database)
router.post('/new', async (req, res, next) => {
  const { title, author, genre, year } = req.body;

  try {
    // Use Sequelize model validation
    const book = await Book.build({ title, author, genre, year });
    await book.validate();
    await book.save();

    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      res.render('new-book', { title: 'New Book', book: { title, author, genre, year, errors } });
    } else {
      next(error);
    }
  }
});

// GET /books/:id (shows book detail form)
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { title: 'Update Book', book });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

// POST /books/:id - (updates book information in the database)
router.post('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      next();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      const book = await Book.findByPk(req.params.id);
      res.render('update-book', { title: 'Update Book', book, errors });
    } else {
      next(error);
    }
  }
});

// POST /books/:id/delete (used to delete a book)
router.post('/:id/delete', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;