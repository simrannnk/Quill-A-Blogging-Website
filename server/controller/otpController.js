import Otp from "../model/otp.js";
import {sendOtpMail }  from '../sendEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const generateOtp = () => {
    return crypto.randomInt(1000, 9999).toString(); // Generates a 4-digit OTP
  };

export const sendOtp = async (req,res) => {
    debugger
    try{
        const { userId } = req.body;
        debugger
        const user = await Otp.findOne({email: userId});
        if(user){
            user.createdAt = new Date()
            let genratedOTP = generateOtp();
            if(user.otp === genratedOTP){
                genratedOTP = generateOtp();
            }
            user.otp = genratedOTP;
            sendOtpMail(userId, genratedOTP)
            await user.save();
        }
        else{
            const genratedOTP = generateOtp();
            sendOtpMail(userId, genratedOTP);
            const otpData = {
                email : userId,
                otp: genratedOTP,
                createdAt: new Date()
            }
            const newUser = otpData && new Otp(otpData);
            await newUser.save();
        }
        res.status(200).json({ message: "OTP sent successfullyyyyy", status: "SUCCESS"})
    }catch(err){
        console.log("error is", err);
        res.status(500).json({message: "Failed to send OTP", status : "FAIL"})
    }
}

export const validateOtp = async (req,res) => {
    try{
        const { userId, otp} = req.body;
        const user = await Otp.findOne({email: userId});
        if(user){
            if(user.otp === otp){
                res.status(200).json({ message: "OTP validated successfully", status: "SUCCESS"})
            }
            else{
                res.status(200).json({message: "Invalid OTP entered", status : "FAILURE"})
            }
        }
        else{
            res.status(500).json({message: "Failed to validate OTP", status : "FAIL"})
        }  
    }catch(err){
        res.status(500).json({message: "Failed to validate OTP", status : "FAIL"})
    }
}