import React from 'react';
import {Routes, Route, } from "react-router-dom";
import Home from './container/Home';
import Login from "./components/login";

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Home />} />

    </Routes>
  )
}
