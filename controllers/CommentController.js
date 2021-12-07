const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { check, body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.create_comment_post = [
    // Validate and sanitize the name field.
    check('name', 'Name required').trim().isLength({ min: 1 }).escape(),
    check('content', 'Content required').trim().isLength({ min: 1 }).escape(),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(500).json({ msg: 'error' });
        } else {
            const post = await Post.findById(req.params.id).exec();
            const comment = new Comment({
                Name: req.query.name,
                Content: req.query.content,
                Timestamp: new Date(),
                Post: post,
            }).save((err, rest) => {
                if (err) {
                    res.status(500).json({ msg: 'error' });
                } else {
                    Post.findByIdAndUpdate(
                        req.params.id,
                        { $push: { Comments: rest } },
                        { upsert: true, new: true },
                        (err, data) => {
                            if (err) {
                                res.status(400).json({
                                    msg: 'error',
                                });
                            } else {
                                res.status(200).json({
                                    msg: 'comment create successful',
                                });
                            }
                        }
                    );
                }
            });
        }
    },
];

/* get delete */
exports.delete_comment_delete = async (req, res, next) => {
    if (req.user == undefined) {
        res.json('Please confirm you have permission.');
    } else if (req.user.isAdmin) {
        //const comment = await Comment.findById(req.params.cid).exec();
        Comment.deleteOne({ _id: req.params.cid })
            .then(function () {
                Post.findOneAndUpdate(
                    req.params.id,
                    { $pull: { Comments: req.params.cid } },
                    (err, data) => {
                        if (err) {
                            res.status(400).json({
                                msg: 'error',
                            });
                        } else {
                            res.status(200).json({
                                msg: 'comment delete successful', // Success
                            });
                        }
                    }
                );
            })
            .catch(function (error) {
                res.status(500).json({ msg: 'error' });
            });
    } else {
        res.status(401).json({ msg: 'unauthorized' });
    }
};
