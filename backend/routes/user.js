import express from 'express'
import { editProfile, followOrUnfollow, getProfile, login, logout, register, suggestedUsers } from '../controllers/user.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('ProfilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, suggestedUsers);
router.route('/followorunfollow/:id').get(isAuthenticated, followOrUnfollow);

export default router;