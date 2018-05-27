'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

const deck = require('./deck');

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

app.put('/api/cards/:id', (req, res) => {
  console.log('putting');
});

app.delete('/api/cards/:id', (req, res) => {
  console.log('deleting');
});





app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});