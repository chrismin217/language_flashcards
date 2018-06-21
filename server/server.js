'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const bcrypt = require('bcrypt');
const session = require('express-session');
const redis = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');

const saltRounds = 12;
const PORT = process.env.PORT || 8080;
const app = express();

const db = require('../models');

const deck = require('./deck');

/*Static*/
app.use(express.static(path.join(__dirname, '..', '/public')));

/*Body Parser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());

/*Session*/
app.use(session({
  secret : 'secret',
  saveUninitialized : true,
  resave : false,
  cookie : { maxAge : 60000 }
}));

/*Flash*/
app.use(flash());

/*Passport*/
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id : user.id,
    username : user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  db.User.findOne({where : { id : user.id }})
  .then(user => {
    return done(null, {
      id : user.id,
      username : user.username
    });
  });
});

passport.use(new LocalStrategy({passReqToCallback : true}, function(req, username, password, done) {
  db.User.findOne({ where : {username : username} })
    .then(user => {
      if (user === null) {
        console.log('Invalid username or password.');
        return done(null, false, req.flash('loginMessage', 'Invalid username or password'));
      } else {
        bcrypt.compare(password, user.password, function(err, hash) {
          if (!err) {
            var foundUser = user.get();
            delete foundUser.password;
            return done(null, foundUser, req.flash('loginMessage', 'Thank you for signing in, ' + foundUser.username + '!'));
          } else {
            return done(null, false,  req.flash('loginMessage', 'Invalid username or password'));
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
    });

}));

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

/*Solving Error */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();	
});

/*View Engine*/
app.engine('.hbs', exphbs({
  extname : '.hbs',
  defaultLayout: 'main',
  layoutsDir : path.join(__dirname, '..', '/views/layouts'),
  partialsDir : path.join(__dirname, '..', '/views/partials')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '..', '/views'));


/*Pages*/
app.get('/', (req, res) => {

  console.log('homepage.');
  console.log(req.session);

  res.render('index', { 
    title : 'Language Flashcards',
    loginMessage : req.flash('loginMessage'),
    user : req.session.user
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title : 'Please log in..',
    loginMessage : req.flash('loginMessage')
  });
});

app.get('/register', (req, res) => {
  res.render('register', { 
    title : 'Create an Account',
    loginMessage : req.flash('loginMessage') 
  });
});

app.get('/dashboard', (req, res) => {
  console.log('dashboard');
  console.log(req.session);

  if (!req.session.user) {
    return res.status(401).send();
  } else {
    return res.status(200).send('Welcome to your Dashboard!');
  }
});

/*Users*/
app.post('/login', passport.authenticate('local', {
  failureRedirect : '/login',
  failureFlash : true,
}), (req, res) => {
  console.log('logged in');
  return res.redirect('/');
});

app.post('/register', (req, res) => {
  db.User.create({
    username : req.body.username,
    password : req.body.password,
    email : req.body.email
  })
  .then(newUser => {
    res.redirect('/', {loginMessage : 'Thank You! New account created successfully.'});
  })
  .catch(err => {
    return res.redirect('/register', {loginMessage : 'Could not create account.'});
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/*Decks*/
app.get('/api/decks/:uid', (req, res) => {
  /*retrieve all decks for a single user*/
  console.log('getting decks');
});

app.post('/api/decks/new/:uid', (req, res) => {
  /*create a new deck and post it under a user*/
  console.log('posting decks');
});

app.put('/api/decks/:uid', (req, res) => {
  /*edit a user's deck*/
  console.log('putting decks');
});

app.delete('/api/decks/:uid', (req, res) => {
  /*remove a user's deck*/
  console.log('deleting decks');
});


/*Cards*/
app.get('/api/cards/:id', (req, res) => {
  console.log('getting cards from a single deck.');
  let random = Math.floor(Math.random() * deck.length);
  res.json(deck[random]);
});

app.post('/api/cards/:id', (req, res) => {
  console.log('posting a new card to a single deck.');
});

app.put('/api/cards/:id', (req, res) => {
  console.log('editting a card from a single deck.');
});

app.delete('/api/cards/:id', (req, res) => {
  console.log('deleting a card from a single deck.');
});







/*Server*/
app.listen(PORT, () => {
  db.sequelize.sync({ force : false });
  console.log(`Listening on port: ${PORT}`);
});