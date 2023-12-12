import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const NavBar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = async () => {
    if (showLogoutConfirmation) {
      try {
        await auth.signOut();
        navigate("/login");
      } catch (error) {
        console.log('Error logging out: ' + error.message);
      }
    } else {
      // Show confirmation dialog
      setShowLogoutConfirmation(true);
    }
  };

  const handleCancelLogout = () => {
    // Hide confirmation dialog
    setShowLogoutConfirmation(false);
  };

  return (
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

      {/* Logout confirmation dialog */}
      {showLogoutConfirmation && (
        <div className="logout-confirmation">
          <p>Are you sure you want to logout?</p>
          <button onClick={handleLogout}>Yes</button>
          <button onClick={handleCancelLogout}>No</button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
