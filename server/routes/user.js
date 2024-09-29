import express from 'express';
import { updateUser, getUserInfo, getUserList, updateAbout, userExists } from '../controller/userController.js';
import authRouter from './auth.js';

const userRouter = express.Router();

userRouter.post('/update', updateUser)
userRouter.get('/:id/details', getUserInfo)
userRouter.post('/list', getUserList)
userRouter.post('/about', updateAbout)
userRouter.post('/exists', userExists);

export default userRouter;