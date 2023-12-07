import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Adjust the path accordingly
import Signup from './components/signup';
import Login from './components/login';
import './App.css';
import CreateLeagueForm from './components/CreateLeagueForm';
import JoinLeagueForm from './components/JoinLeagueForm';
import YourLeagues from './components/YourLeagues';
import PlayerList from './components/PlayerList';
import CreateTeam from './components/CreateTeam';
import LeagueDetails from './components/LeagueDetails';
import AddToTeam from './components/AddToTeam'
import { useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';

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


  useEffect(() => {
    // Set the active tab to 'signup' on component mount
    setActiveTab('signup');
  }, []); // Empty dependency array ensures this effect runs only once on mount
  
  return (
    <Router>
        { user ? (
          <div>
            <Routes>
              <Route path="/" element={<NavBar />} />
              <Route path="/create-league" element={<CreateLeagueForm />} />
              <Route path="/join-league" element={<JoinLeagueForm />} />
              <Route path="/your-leagues" element={<YourLeagues />} />
              <Route path="/player-list/:leagueId" element={<PlayerList />} />
              <Route path="/create-team/:leagueId" element={<CreateTeam />} />
              <Route path="/league-details/:leagueId" element={<LeagueDetails />} />
              <Route path="/add-to-team/:leagueId" element={<AddToTeam />} />
            </Routes>
            <div className='main_item'>
              <h1>Drafting App</h1>
              <p>Welcome, {user.email}!</p>
            </div>
          </div>
        ) : (
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
        )}
        
    </Router>
  );
};

export default App;
