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

// Liker un post
exports.likePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            switch (req.body.like) {   
                // Si le post est aimé
                case 1:
                    Post.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (like) !" }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                    
                // Si le post est déjà aimé et que l'utilisateur veut retirer son like
                case -1:
                    if (post.usersLiked.find(user => user === req.body.userId)) {
                        Post.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: "Votre avis a bien été modifié !" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                break;

                default:
                    return res.status(500).json({ error, message: 'Action impossible' });
            }
        })
        .catch(error => res.status(500).json({ error, message: 'Post introuvable' }));
}

// Ajouter un commentaire
exports.commentPost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(() => {
            Post.updateOne({ _id: req.params.id }, {
                $push: { comments: {commenterId: req.body.userId, comment: req.body.comment} },
                _id: req.params.id
            })
                .then((post) => res.status(201).json({ post, message: "Commentaire créé !" }))
                .catch(error => res.status(400).json({ error, message: 'Action impossible' }))     
            })
        .catch(error => res.status(500).json({ error, message: 'Post introuvable' }));
}