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

const sampleDeck = require('./sampleDeck'); //fake DB

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
  cookie : { maxAge : 600000 }
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

  console.log('Local Strategy.');
  /*the req.flash() may change back to a message object. don't understand flash() well enough yet..*/

  db.User.findOne({ where : {username : username} })
    .then(user => {
      if (user === null) {
        console.log('Invalid username or password.');
        return done(null, false, req.flash('loginErrorMessage', 'Invalid username or password'));
      } else {
        bcrypt.compare(password, user.password, function(err, hash) {
          if (!err) {
            var foundUser = user.get();
            delete foundUser.password;
            return done(null, foundUser, req.flash('loginSuccessMessage', 'Thank you for signing in, ' + foundUser.username + '!'));
          } else {
            return done(null, false,  req.flash('loginErrorMessage', 'Invalid username or password'));
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
  res.render('index', { 
    title : 'Language Flashcards'
  });
});

app.get('/login', (req, res) => {
  console.log('login page.');
  res.render('login', {
    title : 'Please log in..'
  });
});

app.get('/register', (req, res) => {
  console.log('register page.');
  res.render('register', { 
    title : 'Create an Account',
    loginMessage : req.flash('loginMessage') //change this
  });
});

app.get('/dashboard', (req, res) => {
  console.log('dashboard page.');
  res.render('dashboard', {
    title : 'My Dashboard'
  });
});

/*Users*/
app.post('/login', passport.authenticate('local', {
  failureRedirect : '/login',
  failureFlash : true,
}), (req, res) => {
  console.log(req.body);
  console.log('logged in.');

  return res.json(req.user);
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

/*REFACTOR THESE INTO ROUTES FOLDER LATER.*/
/*Decks*/
app.get('/api/decks/:id', (req, res) => {
  /*retrieve all decks for a single user*/
  console.log('getting decks');
  db.Deck.findAll({ where : {user_id : req.params.id} })
  .then(decks => {
    return res.json(decks);
  })
  .catch(err => {
    console.log(err);
  });

});

app.post('/api/decks/:id', (req, res) => {

  db.Deck.count()
  .then(count => {
    if (count >= 24) {
      res.redirect(409, "/dashboard");
    } else {
      db.Deck.create({
        title : req.body.title,
        native : req.body.native,
        target : req.body.target,
        user_id : req.params.id
      })
      .then(newDeck => {
        return res.redirect("/dashboard");
      })
      .catch(err => {
        console.log(err);
      });
    }

  });

});

app.put('/api/decks/:id', (req, res) => {
  /*edit a user's deck*/
  console.log('editting deck');
});

app.delete('/api/decks/:id', (req, res) => {
  /*remove a user's deck*/
  console.log('deleting deck');

});

/*Samples*/
app.get('/api/demo/:id/:num', (req, res) => {

  console.log(req.params);

  let num = req.params.num;
  let cards = [];

  /*make it so random is unique.. later*/
  for (let i = 0; i < num; i++) {
    let random = Math.floor(Math.random() * sampleDeck.length);
    cards.push(sampleDeck[random]);
  }

  console.log(cards);

  res.json(cards);

});

/*Cards*/
app.get('/api/cards/:id', (req, res) => {

  console.log('getting all cards in a single deck.');
  console.log('deck ID : ', req.params.id);

  db.Card.findAll({ where : {deck_id : req.params.id} })
  .then(cards => {
    console.log(cards);
    res.json(cards);
  })
  .catch(err => {
    console.log(err);
  });

});

app.post('/api/cards/:id', (req, res) => {

  console.log('posting a new card to a single deck.');
  console.log('deck ID : ', req.params.id);
  console.log(req.body);

  db.Card.create({
    question: req.body.question,
    answer : req.body.answer,
    deck_id : req.params.id
  })
  .then(newCard => {
    console.log(newCard);
    return res.json(newCard);
  })
  .catch(err => {
    console.log(err);
  });

});

app.put('/api/cards/:id', (req, res) => {
  console.log('editting a card from a single deck.');
  console.log('deck ID : ', req.params.id);
});

app.delete('/api/cards/:id', (req, res) => {
  console.log('deleting a card from a single deck.');
  console.log('deck ID : ', req.params.id);
});




/*Route Authentication for Dashboard*/
function isAuthenticated(req, res, next) {

  console.log('isAuth middleware.');

  if (req.user) {
    return next();
  } else {
    return res.status(401).json({
      error : 'Must be logged in'
    });
  }

};


/*Server*/
app.listen(PORT, () => {
  db.sequelize.sync({ force : false });
  console.log(`Listening on port: ${PORT}`);
});