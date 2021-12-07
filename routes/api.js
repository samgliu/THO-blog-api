const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const postController = require('../controllers/PostController');
const commentController = require('../controllers/CommentController');

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
router.post('/create-post', postController.create_post_post);
router.get('/:id', postController.post_get);
router.put('/:id', postController.post_put);
router.delete('/:id/delete', postController.post_delete);

/* Comment Routes */
router.post('/:id/comment-create', commentController.create_comment_post);
router.delete(
    '/:id/comment/:cid/delete',
    commentController.delete_comment_delete
);
module.exports = router;
