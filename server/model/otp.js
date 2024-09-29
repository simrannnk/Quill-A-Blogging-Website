import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' }, // OTP expires in 5 minutes
});

const Otp = mongoose.model('otp', otpSchema)
export default Otp;