import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebase'; // Adjust the path accordingly
import Signup from './components/signup';
import Login from './components/login';
import './App.css';
import CreateLeagueForm from './components/CreateLeagueForm';
import JoinLeagueForm from './components/JoinLeagueForm';
import YourLeagues from './components/YourLeagues';

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('signup'); // Added state for active tab

  useEffect(() => {
    // Firebase authentication state listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => {
      // Cleanup the listener on component unmount
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('User logged out successfully!');
    } catch (error) {
      alert('Error logging out: ' + error.message);
    }
  };

  useEffect(() => {
    // Set the active tab to 'signup' on component mount
    setActiveTab('signup');
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <Router>
      <div>
        <h1>Drafting App</h1>

        {user ? (
          <div>
            <p>Welcome, {user.email}!</p>
            <nav>
              <ul>
                <li>
                  <Link to="/create-league">Create a League</Link>
                </li>
                <li>
                  <Link to="/join-league">Join a League</Link>
                </li>
                <li>
                  <Link to="/your-leagues">Your Leagues</Link>
                </li>
                <li>
                  {/* Link the logout button to the home page */}
                  <Link to="/login" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/create-league" element={<CreateLeagueForm />} />
              <Route path="/join-league" element={<JoinLeagueForm />} />
              <Route path="/your-leagues" element={<YourLeagues />} />
            </Routes>
          </div>
        ) : (
          <div>
            <nav className="nav_container">
              <ul className="nav_list">
                <li className="nav_item">
                  <Link
                    to="/"
                    onClick={() => setActiveTab('signup')}
                    className={activeTab === 'signup' ? 'nav_link active' : 'nav_link'}
                  >
                    Sign Up
                  </Link>
                </li>
                <li className="nav_item">
                  <Link
                    to="/login"
                    onClick={() => setActiveTab('login')}
                    className={activeTab === 'login' ? 'nav_link active' : 'nav_link'}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
