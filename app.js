const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

mongoose.connect('mongodb://hzmi:asdf19497@ds016068.mlab.com:16068/authprac');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

app.use(session({
  secret: 'kuma420',
  resave: true,
  saveUninitialized: false
}));

app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

const routes = require('./routes');
app.use(routes);

app.use((req, res, next) => {
  const err = new Error('Page not found.');
  err.status = 404;
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status);
  res.render('error', { title: 'Error', err: err });
});

app.listen(3000, () => {
  console.log('listening...');
});
