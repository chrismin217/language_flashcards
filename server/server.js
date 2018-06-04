'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

/*Static Folder*/
app.use(express.static(path.join(__dirname + 'public')));

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
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

/*Solving Error */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();	
});

/*Login*/
app.post('/login', passport.authenticate('local', {
  failureFlash : 'Invalid username or password.'
}), (req, res) => {
  console.log(req.body);
  res.send('hello');
});

app.post('/register', (req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      db.User.create({
        username : req.body.username,
        password : hash
      })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        return res.send('Failed to create new user.');
      });
    });
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