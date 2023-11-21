/* const Sequelize = require('sequelize');
const sequelize = new Sequelize();
    dialect: 'sqlite',
    storage: 'movies.db'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database successful');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
})(); */


/* const express = require('express');
const path = require('path');
const sequelize = require('./models').sequelize;

const app = express ();
*/


const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

// import Sequelize instance
const sequelize = require('./models').sequelize; 
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// test connection to and sync db 
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  sequelize
  .sync()
  .then(() => {
    console.log('Table was successfully created.');
  })
  .catch((err) => {
    console.error('Unable to create table:', err);
  });

// set up routes
app.use("/", indexRouter);
app.use("/books", booksRouter);



// set up 404 error handler
app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

// global error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  console.error(`Error ${err.status}: ${err.message}`);

  res.status(err.status);
  res.render('error', { title: 'Error', message: err.message });
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



