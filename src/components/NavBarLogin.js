import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 

const NavBarLogin = () => {
    const navigate = useNavigate();
    return (
        <nav className="primary">
          <div className='nav_container2'>
              <button
                className='navbar_link navbar_unclicked'
                to="/"
                onClick={() => navigate('/')}
                >
                  
                Sign Up
              </button>
              <button
                className='navbar_link navbar_unclicked'
                to="/login"
                onClick={() => navigate('/login')}
                
              >
                Login
              </button>
          </div>
        </nav>
    );
}

export default NavBarLogin;