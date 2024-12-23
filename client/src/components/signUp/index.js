import "./style.scss";
import { useState, useEffect } from "react";
// import axiosInstance from "../axiosInstance";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import OtpInput from 'react-otp-input';
import { FaEyeSlash } from "react-icons/fa";

import axiosInstance from "../../service/api";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showError, setShowError] = useState(false);
  const [userCreds, setUserCreds] = useState({
    name: "",
    password: "",
    email: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [otpMsg, setOtpMsg] = useState('');
  const [userExists, setUserExists] = useState(false);

  const handleChange = (otpValue) => {
    setOtp(otpValue);
    setOtpMsg('');
  };

  const storeUserData = (userData, type) => {
    if(type === 'register'){
      const user = {
        userName: userData.username,
        userId: userData.email,
        token: userData.token,
        isAuthenticated: userData.token ? true : false,
        user_id: userData.user_id
      };
    localStorage.setItem('userAuth', JSON.stringify(user));
    }
    else{
      console.log("user data is", userData);
      const user = {
        userId: userData.email,
        isAuthenticated: true,
        user_id: userData.user_id,
        userName: userData.username,
      }
    localStorage.setItem('userAuth', JSON.stringify(user));
    }

  };

  const isValidate = (email, password) => {
      const isemailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email)
      const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)

    if (!isemailValid && !isPasswordValid) return { type: "both", error: "Password and Email Address is not valid." }
    if (!isemailValid) return { type: "email", error: "Email Address is not valid." }
    if (!isPasswordValid) return { type: "password" , error : "Password is not valid" }

    return null;
  }

  const handleShowPassword = () => {
    setShowPass(prev => !prev);
  }
 
  const handleSendOtp = async () => {
    const payload = {
      email : userCreds.email
    }
    await axiosInstance.post('api/user/exists', payload).then((res) => {
      if(res?.data?.exsiting){
        setUserExists(true);
      }
      else{
        setShowOtpModal(true);
        const payload =  {
          userId: userCreds.email
        }
        axiosInstance.post('api/otp/send', payload).then((res) => {
          // navigate('/quill')
        })
        .catch((err) => {
          console.log("error is", err)
        })
      }
      // navigate('/quill')
    })
    .catch((err) => {
      console.log("error is", err)
    })

  }

  const handleContinue = async () => {
    const payload =  {
      userId: userCreds.email,
      otp: otp
    }
    await axiosInstance.post('api/otp/validate', payload).then((res) => {
      if(res.data.status === 'FAILURE')  {
        setOtpMsg('FAILURE')
      }
      else handleSignUp('register');

    })
    .catch((err) => {
      console.log("error is", err);
      setOtpMsg('FAIL')
    })
  }
  const handleSignUp = async (type) => {
    setShowError(true);
    console.log("type is", type)
    if(!isValidate(userCreds.email, userCreds.password)){
      if(type === 'register'){
        const payload = {
          userId: userCreds?.email,
          password: userCreds?.password,
          userName: userCreds?.name,
          joinedOn: new Date()
        }
  
        await axiosInstance.post('api/auth/signup', payload).then((res) => {
          const userData = {
            username:userCreds.name,
            email: userCreds.email,
            token: res.data.token,
            user_id: res.data.user_id,
          }
          storeUserData(userData, 'register')
          navigate('/quill');
        }).catch((err) => {
          console.log("error is", err)
        })
      }
      else{
        const payload = {
          userId: userCreds?.email,
          password: userCreds?.password
        }
  
        await axiosInstance.post('api/auth/login', payload).then((res) => {
          const userData = {
            username: res.data.user.userName,
            email: userCreds.email,
            // token: res.data.token,
            user_id: res.data.user._id,
            isAuthenticated: true
          }
          storeUserData(userData, 'login');
          navigate('/quill');
        }).catch((err) => console.log("error is", err));
      }
    }

  }

  const setCredentials = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    setUserCreds(prev => ({...prev, [name]: value}))
  }


  const resetCredentials = () => {
    setUserCreds({
      name: "",
      password: "",
      email: ""
    })
    setShowError(false);
    setUserExists(false);
    setShowPass(false);
  }

  useEffect(() => {
    if(showOtpModal && resendTimer > 0){
      const timer = setTimeout(() => setResendTimer(prev => prev-1), 1000);
      return () => clearTimeout(timer);  
    }
  },[showOtpModal, resendTimer ])

  return (
    <>
      <div className="signup-wrapper">
        {showOtpModal ? <div className="otp-modal">
          <div className="logo">
            <div className="name" onClick={() => navigate('/quill')} style={{cursor:"pointer"}} >Quill.</div>
          </div>
          <h1>Verify your account</h1>
          <p>Enter the verification code sent to your email id for sign up.</p>
          <OtpInput
          value={otp}
          inputType="tel"
          onChange={handleChange}
          shouldAutoFocus={true} 
          numInputs={4} // Number of OTP input fields
          isInputNum={true} // Only allow numeric input
          separator={<span>-</span>} // Optional separator between inputs
          renderInput={(props) => <input {...props} />}
          inputStyle={{
          width: '40px',
          height: '40px',
          margin: '0 5px',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px solid #ccc',
         }}
          focusStyle={{ border: '1px solid #007bff' }} // Focused input styling
        />
        <div style={{fontSize:'13px', margin:"10px 0 20px 0"}}>{resendTimer === 0 ? <button className="resend-btn" onClick={() => handleSendOtp()}>Resend Code</button> : `Haven't received the email ? Resend code in 00:${resendTimer < 10 ? '0' :''}${resendTimer}`}</div>
        {otpMsg.length > 0 && <div className="otp-error">{otpMsg === 'FAILURE' ? 'You have entered a wrong OTP .' : 'Not able to validate the entered OTP'} </div>}
        <button className="continue-btn" disabled={otpMsg || !otp || otp.length < 4 } onClick={() => handleContinue()}>Continue</button>
      </div> :
      <div className="main-container">
          <div className="signin-form">
            <div className="logo">
              <div className="name" onClick={() => navigate('/quill')} style={{cursor:"pointer"}} >Quill.</div>
            </div>
            <h1>{showSignUp ? 'Join us today' : 'Welcome Back'}</h1>
            {showSignUp ? 
            <div className="form">
              <div className="input">
                <label>Full Name</label>
                <div className="input-contr">
                <input name="name" type="text" value={userCreds?.name} onChange={setCredentials} ></input>
                </div>
              </div>

              <div className="input">
                <label>Email Address</label>
                <div className="input-contr">
                <input name="email" type="email" value={userCreds?.email} onChange={setCredentials}></input>
                </div>
              </div>

              <div className="input">
                <label>Password</label>
                <div className="input-contr">
                  <input name="password" type={showPass ? 'text' : 'password'} value={userCreds?.password} onChange={setCredentials}></input>
                  <div className="pass-text">Password must be at least 8 characters long and must contain at least one capital case alphabet, one special character and one numeric digit.</div>
                  <button onClick={() => handleShowPassword()}>{showPass ? <FaEye/> : <FaEyeSlash/>}</button>
                </div>

              </div>
            </div>
            : <div className="form">
              <div className="input">
                <label>Email Address</label>
              <div className="input-contr">
                <input name="email" type="email" value={userCreds?.email} onChange={setCredentials}></input>
              </div>
              </div>

              <div className="input">
                <label>Password</label>
              <div className="input-contr">
                <input name="password" type={showPass ? 'text' : 'password'} value={userCreds?.password} onChange={setCredentials}></input>
                <button onClick={() => handleShowPassword()}>{showPass ? <FaEye/> : <FaEyeSlash/>}</button>
              </div>
              </div> 
            </div>}
            {(showError && isValidate(userCreds.email, userCreds.password)?.error) && <div className="error-msg">{isValidate(userCreds.email, userCreds.password).error}</div>}
            {userExists && <div className="otp-error">User is already registered with this email address.</div>}
            <button className="signIn-btn" onClick={() => showSignUp ? handleSendOtp() : handleSignUp('signIn')} disabled={ !userCreds?.email || !userCreds?.password || userExists}>{showSignUp ? 'Sign up' : 'Sign in'}</button>

          </div>
          {showSignUp ? (
            <div className="signUp">
              Already a member ?{" "}
              <button className="signUp-btn" onClick={() => {setShowSignUp(false); resetCredentials();}}>
                Sign in here
              </button>
            </div>
          ) : (
            <div className="signUp">
              Don't have an account ?{" "}
              <button className="signUp-btn" onClick={() => {setShowSignUp(true); resetCredentials(); }}>
                Join us today
              </button>
            </div>
          )}
      </div>}
      {/* <img src='/assets/blog-image.avif'/> */}
    </div>
    </>

  );
};

export default SignUp;
