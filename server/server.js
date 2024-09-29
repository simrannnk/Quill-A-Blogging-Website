import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
 import authRouter from './routes/auth.js';
import blogRouter from './routes/blog.js';
import userRouter from './routes/user.js';
import otpRouter from './routes/otp.js';
import { scheduleBlogPublishing } from './schedulerJob.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

scheduleBlogPublishing();

const PORT =  process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("app is listening on port", PORT)
});

mongoose.connect(process.env.MONGO_URL , {useNewUrlParser: true})

.then(() => {
    console.log("moongoose connected")
})
.catch(() => {
    console.log("cant connect to the db")
})

app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter)
