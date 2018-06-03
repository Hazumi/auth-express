const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  return res.render('home', { title: 'Home' });
});

router.get('/login', (req, res, next) => {
  return res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  if(req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if(error || !user) {
        const err = new Error('Wrong email or password');
        err.status = 400;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    const err = new Error('Email and password are required.');
    err.status = 400;
    return next(err);
  }
});

router.get('/register', (req, res) => {
  return res.render('register', { title: 'Sign Up' });
});

router.post('/register', (req, res, next) => {
  if(req.body.name &&
    req.body.email &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {
      if(req.body.password !== req.body.confirmPassword) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }
      const userData = {
        name: req.body.name,
        email: req.body.email,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };
      User.create(userData, function(err, user) {
        if(err) {
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
    } else {
      const err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
});

router.get('/profile', (req, res, next) => {
  if(!req.session.userId) {
    const err = new Error('You must be logged in to view this page');
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec(function(error, user) {
      if(error) {
        return next(error);
      } else {
        return res.render('profile', {
          title: 'Profile',
          name: user.name,
          favorite: user.favoriteBook
        });
      }
    });
});

module.exports = router;
