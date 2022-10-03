const Post = require('../models/Post.model');
const fs = require('fs');

// Récupérer tous les posts
exports.getAllPosts = (req, res) => {
    Post.aggregate([
        {"$lookup": {
            "from": "User",
            "localField": "posterId",
            "foreignField": "_id",
            "as": "User"
        }},
    ]).sort({postNumber:-1})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }));
};

// Récupérer un post
exports.getOnePost = (req, res) => {
    Post.aggregate({ _id: req.params.id } [
        {"$lookup": {
            "from": "User",
            "localField": "posterId",
            "foreignField": "_id",
            "as": "User"
        }}
    ]).sort({postNumber:-1})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

// Créer un post
exports.createPost = (req, res) => {
    const postObject = req.file ? {
        postPicture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    const posterId = req.body.posterId
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
            if (post.posterId !== req.auth.userId && req.body.isAdmin === false) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                Post.findOneAndUpdate({ _id: req.params.id }, { ...postObject, ...req.body, _id: req.params.id }, { returnOriginal: false })
                    .then((post) => res.status(200).json(post))
                    .catch((error) => res.status(400).json(error));
            }
        })
        .catch(error => res.status(404).json({ error }));
};

// Supprimer un post
exports.deletePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
    .then(post => {
        if (post.posterId !== req.auth.userId && req.body.isAdmin === false) {
            res.status(401).json({ message: 'Non autorisé' });
        } else {
            if (post.postPicture) {
                const filename = post.postPicture.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                    .catch(error => res.status(400).json({ error })); 
                });
            } else {
                Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        }
    })
    .catch(error => res.status(404).json({ error }))
};

// Liker un post
exports.likePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {(req.body.like)  
            if (post.usersLiked.find(user => user === req.body.userId)) {
                // Supprimer son like
                Post.updateOne({ _id: req.params.id }, {
                    $inc: { likes: -1 },
                    $pull: { usersLiked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: "Votre avis a bien été modifié !" }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                // Ajouter un like
                Post.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (like) !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}