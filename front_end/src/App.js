import React from 'react';
import {Routes, Route, useNavigate} from "react-router-dom";
import Home from './container/Home';
import Login from "./components/Login";

export default function App() {
  return (
    <Routes>
      <Route path="Login" element={<Login />} />
      <Route path="/*" element={<Home />} />

    </Routes>
  )
}
