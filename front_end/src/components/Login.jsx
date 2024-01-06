import React, {useCallback, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import ppointVideo from "../assets/ppoint.mp4";
import logo from "../assets/PPointLogo.png"
import {client} from '../client'
import { jwtDecode } from 'jwt-decode';





const Login = () => {
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback((response) => {
    console.log('Encoded JWT ID token:', response.credential);
    
    // Ideally, you would send the token to a backend service to verify it against Google's 
    // OAuth servers to ensure it's valid and to retrieve the user's profile information
    // For simplicity, let's assume we decode it on the frontend (not recommended for production)
  
    const decodedToken = jwtDecode(response.credential);
    const userId = decodedToken.sub; // This is the Google User ID
  
    // Query Sanity for a user with this ID
    const query = `*[_type == "user" && _id == $userId][0]`;
    client.fetch(query, { userId }).then(user => {
      if (user) {
        // User exists, proceed with login
        console.log('User exists:', user);
        localStorage.setItem('session', JSON.stringify({ userId: user._id, name: user.name }));
        navigate('/', { replace: true });
      } else {
        // User doesn't exist, create a new one
        const newUser = {
          _type: 'user',
          _id: `google-${userId}`,
          name: decodedToken.name,
          image: decodedToken.picture
        };
  
        client.createIfNotExists(newUser).then(() => {
          localStorage.setItem('session', JSON.stringify({ userId: newUser._id, name: newUser.name }));
          navigate('/', { replace: true });
        });
      }
    }).catch(error => {
      console.error('Sanity user fetch/create error:', error);
    });
  }, [navigate]);

  


  const handleSignOut = () => {
    // Sign out the user from your application
    localStorage.removeItem('user');
    // Sign out the user from Google
    google.accounts.id.disableAutoSelect();
    // Navigate to the login page or elsewhere as needed
    navigate('/login');
  };

  
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { theme: 'outline', size: 'large' } // Customize the button as needed
    );

    google.accounts.id.prompt();
  }, [handleCredentialResponse]);

  

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
            {/* Google Sign-In button container */}
            <div id='signInDiv'></div> 
            {/* Sign Out button */}
            {localStorage.getItem('user') && (
              <button onClick={handleSignOut} className="bg-red-600 p-3 rounded-lg cursor-pointer">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
  )
}

export default Login