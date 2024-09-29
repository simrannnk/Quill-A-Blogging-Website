import express from 'express';
import { loginUser, signupUser } from '../controller/userController.js';

const authRouter = express.Router();

authRouter.post('/signup', signupUser)
authRouter.post('/login', loginUser)


export default authRouter;