var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');




var indexRouter = require('./routes/index');

const app = express();

app.use(cors());

// Import the mongoose module
const mongoose = require("mongoose");
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See:https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

// Define the database URL to connect to.
// const mongoDB = 'mongodb://psi011:psi011@localhost:27017/psi011?retryWrites=true&authSource=psi011';
const mongoDB = 'mongodb+srv://psi11:ola@cluster0.ykdwmz2.mongodb.net/?retryWrites=true&w=majority';



// Wait for database to connect, logging an error if there is a problem 
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
