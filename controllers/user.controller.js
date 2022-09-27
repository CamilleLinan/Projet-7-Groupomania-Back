const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');

// Import du model User
const User = require('../models/User.model');

// Utilisation de dotenv
const dotenv = require('dotenv');
const { signUpErrors } = require('../utils/errors.utils');
dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;

// Créer un compte utilisateur
exports.signup = async (req, res) => {
    if (emailValidator.validate(req.body.email)) {
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
                .then((user) => res.status(201).json({ userId: user._id, message: 'Utilisateur créé !' }))
                .catch((error) => {
                    const errors = signUpErrors(error)
                    res.status(400).send({ errors })
                });
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({ error: `Le format de l'adresse email est invalide.` })
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
                    firstname: user.firstname,
                    lastname: user.lastname,
                    isAdmin: user.isAdmin,
                    token: jwt.sign({
                        userId: user._id,
                        isAdmin: user.isAdmin, }, 
                        SECRET_TOKEN,
                        { expiresIn: '24h' })
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json({ err }));
};

// Récupérer un utilisateur
exports.getOneUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json({ err }));
};

// Modifier un utilisateur
exports.updateUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            if (user.id !== req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            } else {
                User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                    .then((user) => res.status(200).json({ user, message: 'Informations modifiées !' }))
                    .catch(err => {
                        res.status(400).json({ err })
                    });    
            }
        })
        .catch(err => {
            res.status(404).json({ err })
        });
};

// Modifier mot de passe
exports.updatePassword = async (req, res) => {
    const user = await User.findById({ _id: req.params.id });
    if (!user) return res.status(404).json('Utilisateur introuvable');
    if (user.id !== req.auth.userId) return res.json(401).send('Non autorisé')

    let newPassword = req.body.password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword.toString(), salt);

    user.save();
    res.status(200).send(user)
};

// Modifier la photo de profil
exports.updateUserPhoto = (req, res) => {
    const newUserPicture = req.file ? {
        userPicture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    User.findOne({ _id: req.params.id })
        .then(user => {
            if (user.id !== req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            } else {
                User.updateOne({ _id: req.params.id }, { ...newUserPicture, _id: req.params.id })
                    .then((user) => res.status(200).json({ user, message: 'Photo de profil modifiée !' }))
                    .catch(err => {
                        res.status(400).json({ err })
                    }); 
            }
        })
        .catch(err => {
            res.status(404).json({ err })
        });
}

// Supprimer un utilisateur
exports.deleteUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            if (user.id != req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            } else { 
                User.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                        .catch(err => res.status(400).json({ err }));
            }
        })
        .catch(err => res.status(404).json({ err }));
};