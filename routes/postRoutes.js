
import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment
  } from '../controllers/postController.js';

const router = express.Router();


router.get('/', getAllPosts);
router.get('/:id', getPost);


router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

router.post('/:id/like', auth, toggleLike);


router.post('/:id/comments', auth, addComment);
router.delete('/:postId/comments/:commentId', auth, deleteComment);

export default router;
