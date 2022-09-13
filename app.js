const express = require('express');

// Connexion à la base de données
const mongodb = require('./db');

// Création de l'application avec express
const app = express();

// Headers pour éviter les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Conversion de la requête
app.use(express.json());
app.use(express.urlencoded({extended:false}));


module.exports = app;