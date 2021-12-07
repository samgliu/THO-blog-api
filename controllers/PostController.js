const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { check, body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

/* index */
exports.index_get = (req, res, next) => {
    console.log('index_get');
    res.redirect('/posts');
};

/* posts_get */
exports.posts_get = async (req, res, next) => {
    const posts = await Post.find({})
        .populate('User')
        .populate('Comments')
        .sort({ Timestamp: -1 });
    res.json(posts);
};

/* create new */
exports.create_post_get = function (req, res, next) {
    res.json('create_post_get');
};

exports.create_post_post = [
    // Validate and sanitize the name field.
    check('topic', 'Topic required').trim().isLength({ min: 1 }).escape(),
    check('content', 'Content required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(500).json({ msg: 'error' });
        } else {
            if (req.user == undefined) {
                res.status(401).json({ msg: 'unauthorized' });
            }
            const post = new Post({
                Topic: req.query.topic,
                Content: req.query.content,
                Timestamp: new Date(),
                User: req.user,
                Comments: [],
            }).save((err, rest) => {
                if (err) {
                    res.status(500).json({ msg: 'error' });
                } else {
                    res.status(200).json({ msg: 'post create successfully' });
                }
            });
        }
    },
];

/* get delete */
exports.post_delete = (req, res, next) => {
    if (req.user == undefined) {
        res.json('Please confirm you have permission.');
    } else if (req.user.isAdmin) {
        Post.deleteOne({ _id: req.params.id })
            .then(function () {
                res.status(200).json({ msg: 'delete successfully' }); // Success
            })
            .catch(function (error) {
                res.status(500).json({ msg: 'error' });
            });
    } else {
        res.status(401).json({ msg: 'unauthorized' });
    }
};