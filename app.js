const express = require('express');
const path = require('path');

// Connexion à la base de données
const mongodb = require('./db');

// Import des routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

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

// Routes de l'API
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;