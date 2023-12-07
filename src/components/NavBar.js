import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 

const NavBar =  () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await auth.signOut();
        alert('User logged out successfully!');
        navigate("/login");
      } catch (error) {
        alert('Error logging out: ' + error.message);
      }
    };


    return(
    <div>
      <nav className="primary">
        <div className='nav_container'>
          <button className="navbar_link navbar_unclicked" onClick={() => navigate('/')}>Home</button>
          <button className='navbar_link navbar_unclicked' onClick={() => navigate("/create-league")}>Create a League</button>
          <button className='navbar_link navbar_unclicked' onClick={() => navigate("/join-league")}>Join a League</button>
          <button className='navbar_link navbar_unclicked' onClick={() => navigate("/your-leagues")}>Your Leagues</button>
          {/* Link the logout button to the home page */}
          <button className='navbar_link navbar_unclicked' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </div>
    );
}


export default NavBar;