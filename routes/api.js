const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const postController = require('../controllers/PostController');

/* GET index page. */
router.get('/', postController.index_get);

/* GET posts home page. */
router.get('/posts', postController.posts_get);

/* User Routes */
router.get('/signup', userController.signup_get);
router.post('/signup', userController.signup_post);
router.get('/signin', userController.signin_get);
router.post('/signin', userController.signin_post);
router.put('/upgrade-admin', userController.upgrade_admin_put); // upgrade to admin
router.get('/logout', userController.logout_get);

/* Post Routes */
router.get('/create-post', postController.create_post_get);
router.post('/create-post', postController.create_post_get);
router.delete('/:id/delete', postController.delete_post_get);

module.exports = router;
