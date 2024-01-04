import React from 'react';
import GoogleLogin from "react-google-login";
import {useNavigate} from "react-router-dom";
import ppointVideo from "../assets/ppoint.mp4";
import logo from "../assets/PPointLogo.png"
import { FcGoogle } from 'react-icons/fc';
import {client} from '../client'




const Login = () => {
  const navigate = useNavigate();

  const handleLoginFailure = (response) => {
    console.error('Failed to log in:', response);
    // Show an error message to the user
  }


  const responseGoogle = (response) => {
    console.log("Google response:", response);
    if (!response.profileObj) {
      console.error('Google login response is missing profileObj:', response);
      // Handle the error here. For example, you might want to show an error message to the user.
      return;
    }
  
    // If profileObj is present, proceed with your logic
    localStorage.setItem("user", JSON.stringify(response.profileObj));
  
    const { name, googleId, imageUrl } = response.profileObj;
    
  
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    }
  
    client.createIfNotExists(doc)
    .then(() => {
      navigate("/", { replace: true });
    })
    .catch((error) => {
      console.error("Error creating user in Sanity:", error);
    });
  }
  
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
        src={ppointVideo}
        type="video/mp4"
        loop
        control="false"
        muted
        autoPlay
        className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 bottom-0 left-0 right-0 bg-blackOverlay '>
          <div className='p-5'>
            <img src={logo} width="150px" alt="logo" />
          </div>

          <div className='shadow-2xl'>
            <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            render={(renderProps) => (
              <button
              type="button"
              className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              >
                <FcGoogle className="mr-4"/> Sign in

              </button>
              )}
              onSuccess={responseGoogle}
              onFailure={handleLoginFailure}
              cookiePolicy="single_host_origin"


            
            />

          </div>
        </div>
      </div>
      </div>
  )
}

export default Login