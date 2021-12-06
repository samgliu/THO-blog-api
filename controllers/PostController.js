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
        .populate('Comment')
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
            res.json(errors);
        } else {
            const message = new Post({
                Topic: req.query.topic,
                Content: req.query.content,
                Timestamp: new Date(),
                User: req.user,
            }).save((err, rest) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        }
    },
];

/* post delete */
exports.delete_post_get = (req, res, next) => {
    if (!req.user == undefined && req.user.isAdmin) {
        Post.deleteOne({ _id: req.params.id })
            .then(function () {
                res.redirect('/'); // Success
            })
            .catch(function (error) {
                // Failure
            });
    } else {
        res.json('Please confirm you have permission.');
    }
};
