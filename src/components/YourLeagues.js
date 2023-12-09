import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Adjust the path accordingly
import { Link } from 'react-router-dom'; // Import Link from React Router
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavBar from "./NavBar"

const YourLeagues = () => {
  const [userLeagues, setUserLeagues] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchUserLeagues = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Handle the case where the user is not authenticated
          return;
        }

        const userUID = user.uid;

        const response = await fetch(`http://localhost:4000/api/leagues/userLeagues/${userUID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error fetching user leagues:', response.statusText);
          return;
        }

        const leagues = await response.json();
        console.log('Retrieved Leagues:', leagues);
        setUserLeagues(leagues);
      } catch (error) {
        console.error('Error fetching user leagues:', error.message);
      }
    };

    fetchUserLeagues();
  }, []);

  // Handle league click event
  const handleLeagueClick = (leagueId) => {
    console.log(userLeagues)
    console.log('Clicked on leagueId:', leagueId);
    navigate(`/league-details/${leagueId}`);
  };

  return (
    <div>
      <NavBar />
      <div className='main_item'>
        <h2>Your Leagues</h2>
        {userLeagues.length === 0 ? (
          <p>You are not in any leagues.</p>
        ) : (
          <ul>
            {userLeagues.map((league) => (
              <li key={league.id} onClick={() => handleLeagueClick(league._id)} style={{ cursor: 'pointer' }}>
                <button onClick = {() => navigate(`/league-details/${league._id}`)} className='detail'>{league.name}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default YourLeagues;
