'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const PORT = process.env.PORT || 8080;
const app = express();

const deck = require('./deck');

const db = require('../models');

/*Body Parser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());

/*Session*/
app.use(session({
  secret : 'secret',
  saveUninitialized : true,
  resave : false
}));

/*Passport initialize*/
app.use(passport.initialize());
app.use(passport.session());

/*Validator*/
app.use(expressValidator({
  errorFormatter : function(param, msg, value) {

    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }

}));

/*Flash*/
app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});

/*Solving Error */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();	
});

/*Pages*/


/*Login Routes*/
app.post('/login', (req, res) => {
  db.User.findOne({ where : { 
    username : req.body.username,
    password : req.body.password
  }})
  .then(user => {
    if (user) {
      res.redirect('http://127.0.0.1:3000/index.html');
    } else {
      return res.status(500).json({error : 'Invalid username or password.'});
    }
  });
});

app.post('/register', (req, res) => {
  db.User.create({
    username : req.body.username,
    password : req.body.password,
    email : req.body.email
  })
  .then(newUser => {
    res.redirect("http://127.0.0.1:3000/index.html");
  })
  .catch(err => {
    return res.send('failed.');
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
})





/*Decks*/



/*Cards*/
app.get('/api/cards', (req, res) => {
  let random = Math.floor(Math.random() * deck.length);
  res.json(deck[random]);
});

app.post('/api/cards', (req, res) => {
  console.log('posting');
});


app.put('/api/cards/:id', (req, res) => {
  console.log('putting');
});

app.delete('/api/cards/:id', (req, res) => {
  console.log('deleting');
});

/*Server*/
app.listen(PORT, () => {
  db.sequelize.sync({ force : false });
  console.log(`Listening on port: ${PORT}`);
});