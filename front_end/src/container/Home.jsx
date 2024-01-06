import React, {useState, useRef, useEffect} from 'react';
import {HiMenu} from "react-icons/hi";
import {AiFillCloseCircle} from "react-icons/ai";
import {Link, Route, Routes} from "react-router-dom";


import {Sidebar, UserProfile} from "../components";
import Pins from "./Pins"
import {client} from "../client";
import logo from "../assets/PPointLogo.png";
import { userQuery } from '../utils/data';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null)

  const userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query)
    .then((data) => {
      setUser(data[0]);
        })
  }, [userInfo?.googleId]);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])
  
  
  return (
    <div className='flex bg-[#3C3D47] md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user} />
      </div>
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between shadow-md'>
        <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)}/>
        <Link to="/">
          <img src={logo} alt="logo" className='w-20'/>
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.img} alt="logo" className='w-20'/>
        </Link>
        </div>
        {toggleSidebar && (
        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2'>
            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
          </div>
          <Sidebar user={user && user} closeToggle = {setToggleSidebar}/>
        </div>
      )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />}/>
          <Route path="/" element={<Pins user={user && user}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home