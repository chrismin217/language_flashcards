'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');

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
  resave : false
}));

/*Flash*/
app.use(flash());
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages', 'Thank You for signing in!');
    res.locals.error_messages = req.flash('error_messages', 'Invalid username or password.');
    next();
});

/*Passport initialize*/
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

passport.use(new LocalStrategy(function(username, password, done) {

  db.User.findOne({ where : {username : username} })
    .then(user => {
      if(user === null) {
        return done(null, false, {message : 'bad username or password'});
      } else {
        bcrypt.compare(password, user.password)
        .then(res => {
          if(res) {
            var foundUser = user.get();
            delete foundUser.password;
            return done(null, foundUser);
          } else {
            return done(null, false, {message : 'bad username or password'});
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
/*app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '..', '/views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname : '.hbs',
  layoutsDir : 'views/layouts',
  partialsDir : 'views/partials'
}));
*/

/*Users*/
app.post('/login', (req, res) => {
  db.User.findOne({ where : { 
    username : req.body.username,
    password : req.body.password
  }})
  .then(user => {
    
    if (user === null) {
      console.log('Error.');
      res.redirect('/');
    } else {
      console.log('Sign-in successful.');
      return res.redirect('/');
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
    res.redirect("/");
  })
  .catch(err => {
    return res.send('failed.');
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

/*Decks*/
app.get('/api/decks', (req, res) => {
  console.log('getting decks');
});

app.post('/api/decks', (req, res) => {
  console.log('posting decks');
});

app.put('/api/decks', (req, res) => {
  console.log('putting decks');
});

app.delete('/api/decks', (req, res) => {
  console.log('deleting decks');
});


/*Cards*/
app.get('/api/cards', (req, res) => {
  console.log('getting cards');
  let random = Math.floor(Math.random() * deck.length);
  res.json(deck[random]);
});

app.post('/api/cards', (req, res) => {
  console.log('posting cards');
});

app.put('/api/cards', (req, res) => {
  console.log('putting cards');
});

app.delete('/api/cards', (req, res) => {
  console.log('deleting cards');
});

/*Server*/
app.listen(PORT, () => {
  db.sequelize.sync({ force : false });
  console.log(`Listening on port: ${PORT}`);
});