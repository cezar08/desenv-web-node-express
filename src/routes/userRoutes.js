import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getPostsByUserId,
    createPostByUserId
} from '../controllers/userController.js';
const router = express.Router();
// Definindo as rotas
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/:id/posts', getPostsByUserId);
router.post('/:id/posts', createPostByUserId);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;