import express from 'express';
import { createUser, loginUser, getAllUsers, updateUser, deleteUser } from '../controller/usercontroller.js';
import { auth } from '../middleware/auth.js';
import { loginValidation, userValidation } from '../middleware/validation.js';
import { adminOnly } from '../utils/utility.js';

const router = express.Router();

router.post('/users', userValidation, createUser); 
router.post('/login',loginValidation ,loginUser); 
router.get('/users' , auth, adminOnly, getAllUsers); 
router.put('/users/:id', auth, updateUser); 
router.delete('/users/:id', auth, deleteUser); 
router.put('/reset-password', auth, resetPassword);

export default router;
