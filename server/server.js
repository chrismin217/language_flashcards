'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const PORT = process.env.PORT || 3000;
const app = express();

const deck = require('./deck');

/*Nodemon is complaining, out for now.*/

/*app.configure(function() {
  app.use(express.cookieParser('secret'));
  app.use(express.session({
    cookie : { maxAge : 60000 }
  }));
  app.use(flash());
});*/

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();	
});

app.get('/api/cards', (req, res) => {
  let random = Math.floor(Math.random() * deck.length);
  console.log(deck[random]);
  res.json(deck[random]);
});

app.post('/api/cards', (req, res) => {
  console.log('posting');
});

app.post('/login', passport.authenticate('local', { 
  failureFlash : 'Invalid username or password.'
}), (req, res) => {
  res.redirect();
});


app.put('/api/cards/:id', (req, res) => {
  console.log('putting');
});

app.delete('/api/cards/:id', (req, res) => {
  console.log('deleting');
});





app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});