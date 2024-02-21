import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Home from '../Pages/Home.jsx'
import Signup from '../Pages/Signup.jsx';
import Test from '../Pages/Test.jsx';
import SetPassword from '../components/SetPassword.jsx';
import Login from '../Pages/Login.jsx';
import ProfileCreation from '../Pages/ProfileCreation.jsx';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile-creation" element={<ProfileCreation/>} />
          <Route path="/set-password" element={<SetPassword/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
