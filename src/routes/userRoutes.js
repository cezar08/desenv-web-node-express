import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getPostsByUserId,
    createPostByUserId
} from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { requirePermission, requireRole } from '../middlewares/authorizationMiddleware.js';
const router = express.Router();
// Definindo as rotas
router.get('/', requireAuth, requirePermission('users:read'), getAllUsers);
router.get('/:id', requireAuth, getUserById);
router.get('/:id/posts', requireAuth, requirePermission('posts:read'), getPostsByUserId);
router.post('/:id/posts', requireAuth, requirePermission('posts:create'), createPostByUserId);
router.put('/:id', requireAuth, requirePermission('users:update'), updateUser);
router.delete('/:id', requireAuth, requireRole('admin'), deleteUser);
export default router;