import User from "../model/user.js";
import { generateToken } from "../SecretToken.js";

const sendOTP = async (email) => {
    const payload =  {
      userId: email
    }
    await axiosInstance.post('api/otp/send', payload).then((res) => {
    })
    .catch((err) => {
      console.log("error is", err)
    })
}


export const userExists = async (req,res) => {
    try{
        const { email } = req.body;
        const userExists = await User.findOne({userId: email });
        if(userExists){
            return res.status(200).json({ message: 'User already exists', user_id: userExists._id, exsiting: true});
        }
        else{
            return res.status(200).json({message: "User is not already registered", exsiting: false})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"})
    }
}

export const signupUser = async (req, res) => {
    try{
        const userData = req.body;
        const email = userData.userId
        const userExists = await User.findOne({ email });
        if(userExists){
            const existingUser = await User.findById(email);
            return res.status(400).json({ message: 'User already exists', user_id: existingUser._id });
        }
        else{
            const newUser = userData && new User(userData);
            await newUser.save(); 
            const token =  generateToken(newUser._id);
            // sendWelcomeMail(userData.userId, userData.userName);
            res.status(200).json({message: "User is succesfully signed up", status: "SUCCESS", token, user_id: newUser._id})
        }

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"})
    }
}


export const loginUser = async (req, res) => {
    try{
        const userData = req.body;
        const checkUserExists = await User.findOne({userId: userData.userId});
        if(checkUserExists) res.status(200).json({ message: "User is successfully logged in", status: "SUCESS", user: checkUserExists})
        else res.status(401).json({message: "Please enter valid credentials", status: "FAILURE"})
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"}) 
    }
}

export const updateUser = async (req, res) => {
    const {firstUser, secondUser, unfollow} = req.body;
    try{
        const primary = await User.findById(firstUser);
        const secondary = await User.findById(secondUser);
        if(primary && secondary){
            if(unfollow){
                primary.following = primary.following.filter((item) => {
                    return item !== secondUser;
                })
                secondary.followers = secondary.followers.filter((item) => {
                    return item !== firstUser;
                })

            }
            else{
                primary.following.push(secondUser);
                secondary.followers.push(firstUser);
            }
 ``
            await primary.save();
            await secondary.save();
            res.status(200).json({message: "User successfully updated ", primary: primary, secondary})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"})
    }
}

export const getUserInfo = async (req, res) => {
    const user_id = req.params.id;
    try{
        const userFound = await User.findById(user_id);
        if(userFound){
            res.status(200).json({message: "User successfully updated", user: userFound})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"})
    }
}

export const getUserList = async (req,res) => {
    const { userList }  = req.body;
    try{
        const allUsers = await User.find();
        const userData = allUsers.filter((item) => {
            if(userList.includes((item._id).toString())) return item;
        })
        if(userData){
            res.status(200).json({message: "User list is successfully fetched", userData})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"})
    }
}


export const updateAbout = async (req, res) => {
    const { aboutUser, userId } = req.body;
    try{
        const user = await User.findById(userId);
        if(user){
            user.about = aboutUser
            await user.save();
            res.status(200).json({message: "User successfully updated "})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message, status: "FAILURE"})
    }
}
