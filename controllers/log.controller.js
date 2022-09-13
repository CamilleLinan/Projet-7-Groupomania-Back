const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
 
// Import du modèle User
const User = require('../models/User.model');

// Utilisation de dotenv
const dotenv = require('dotenv');
dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;

// Créer un compte utilisateur
exports.signup = async (req, res) => {
    const {firstname, lastname, email, password} = req.body

    try {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                    isAdmin: false,
                });
                user.save()
                    .then((user) => res.status(201).json({
                        userId: user.id,
                        isAdmin: user.isAdmin,
                        token: jwt.sign({
                            userId: user.id,
                            isAdmin: user.isAdmin,
                        }, `${SECRET_TOKEN}`, {
                            expiresIn: '24h'
                        }
                    ),
                    message: `Utilisateur créé`,
                }))
                    .catch(error => res.status(400).json({ error, message: 'impossible de créer le compte' }));
            })
            .catch(error => res.status(500).json({ error, message: 'erreur serveur' }));
    } catch (error) {
        console.log(error)
    }
}

// Se connecter à son compte utilisateur
exports.signin = async (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur introuvable' });
            }
        
        bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({ message: 'Mot de passe incorrect' });
                }
                res.status(200).json({
                    userId: user.id,
                    isAdmin: user.isAdmin,
                    token: jwt.sign({
                        userId: user.id,
                        isAdmin: user.isAdmin,
                    }, `${SECRET_TOKEN}`,
                        { expiresIn: '24h' })
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};