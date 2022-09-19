const fs = require('fs');

// Import du model User
const User = require('../models/User.model');

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.find().select('-password')
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json({ err }));
};

// Récupérer un utilisateur
exports.getOneUser = (req, res) => {
    User.findOne({ _id: req.params.id }).select('-password')
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
                    .then((user) => res.status(200).json({ user, message: 'Profil modifié !' }))
                    .catch(err => {
                        res.status(400).json({ err })
                    });    
            }
        })
        .catch(err => {
            res.status(404).json({ err })
        });
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