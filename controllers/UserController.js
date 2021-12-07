const User = require('../models/user');
const { body, check, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

/* sign up */
exports.signup_get = function (req, res, next) {
    res.json('signup_get');
};

exports.signup_post = [
    // Validate and sanitize the name field.
    check('firstname', 'Firstname required')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    check('lastname', 'Lastname required').trim().isLength({ min: 1 }).escape(),
    check('username').custom((value, { req }) => {
        // verify email existence
        return new Promise((resolve, reject) => {
            User.findOne(
                { Username: req.query.username },
                function (err, user) {
                    if (err) {
                        reject(new Error('Server Error'));
                    }
                    if (Boolean(user)) {
                        reject(new Error('Username already in use'));
                    }
                    resolve(true);
                }
            );
        });
    }),
    check('email').custom((value, { req }) => {
        // verify email existence
        return new Promise((resolve, reject) => {
            User.findOne({ Email: req.query.email }, function (err, user) {
                if (err) {
                    reject(new Error('Server Error'));
                }
                if (Boolean(user)) {
                    reject(new Error('E-mail already in use'));
                }
                resolve(true);
            });
        });
    }),
    check('password', 'Password required').isLength({ min: 5 }).escape(),
    check('confirm').custom((value, { req }) => {
        if (value !== req.query.password) {
            throw new Error('Password confirmation does not match! Try again.');
        }
        return true;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors });
        } else {
            bcrypt.hash(req.query.password, 8, (err, hashedPassword) => {
                // if err, do something
                // otherwise, store hashedPassword in DB
                if (err) {
                    res.status(500).json({ msg: 'error' });
                }
                const user = new User({
                    Firstname: req.query.firstname,
                    Lastname: req.query.lastname,
                    Username: req.query.username,
                    Password: hashedPassword,
                    Email: req.query.email,
                    isAdmin: false,
                }).save((err, rest) => {
                    if (err) {
                        res.status(500).json({ msg: 'error' });
                    } else {
                        res.status(200).json({
                            msg: 'user create successfully',
                        });
                    }
                });
            });
        }
    },
];

/* sign in */
exports.signin_get = (req, res, next) => {
    res.json('signin_get');
};

exports.signin_post = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ msg: 'login failed' });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ msg: 'login successfully' });
        });
    })(req, res, next);
};
/*
exports.signin_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
});
*/
/*  upgrade user to admin */
exports.upgrade_admin_put = [
    check('admin_password').custom((value, { reqest }) => {
        // verify
        if (process.env.Admin_PASSWORD !== value) {
            throw new Error('Wrong Admin Password');
        } else {
            return true;
        }
    }),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (req.user == undefined) {
            res.status(401).json({ msg: 'unauthorized' });
        } else if (!errors.isEmpty()) {
            res.status(500).json({ msg: 'error' });
        } else {
            const filter = { _id: req.user._id };
            const update = { isAdmin: true };
            await User.findOneAndUpdate(filter, update, {
                returnOriginal: false,
            });
            res.status(200).json({ msg: 'upgrade to admin successfully' });
        }
    },
];

exports.logout_get = (req, res) => {
    req.logout();
    res.redirect('/');
};
