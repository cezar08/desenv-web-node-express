import express from 'express';
import { getPostById } from '../controllers/postController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requirePermission } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

// GET /posts/:id - Retorna post incluindo autor (N -> 1)
router.get('/:id', requireAuth, requirePermission('posts:read'), getPostById);

export default router;

