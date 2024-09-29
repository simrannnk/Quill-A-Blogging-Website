import express from 'express';
import { sendOtp, validateOtp } from '../controller/otpController.js';

const otpRouter = express.Router();

otpRouter.post('/send', sendOtp)
otpRouter.post('/validate', validateOtp)

export default otpRouter; 