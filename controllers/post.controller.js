const Post = require('../models/Post.model');
const fs = require('fs');

// Récupérer tous les posts
exports.getAllPosts = (req, res) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }));
};

// Récupérer un post
exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

// Créer un post
exports.createPost = (req, res) => {
    const postObject = req.file ? {
        postPicture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    const posterId = req.body.posterId;
    const message = req.body.message;

    const post = new Post({
        ...postObject,
        posterId,
        message
    });

    post.save()
        .then((post) => res.status(201).json({ post, message: "Post créé avec succès !" }))
        .catch(error => res.status(400).json({ error }));
};

// Éditer un post
exports.updatePost = (req, res) => {
    const postObject = req.file ? {
        postPicture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (post.posterId !== req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                Post.updateOne({ _id: req.params.id }, { ...postObject, ...req.body, _id: req.params.id })
                    .then((updatePost) => res.status(200).json({ updatePost, message: "Post modifié !" }))
                    .catch(err => res.status(400).json({ err }));
            }
        })
        .catch(err => res.status(404).json({ err, message: 'post introuvable' }));
};

// Supprimer un post
exports.deletePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
    .then(post => {
        if (post.posterId !== req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' });
        } else {
            Post.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(404).json({ error }))
};