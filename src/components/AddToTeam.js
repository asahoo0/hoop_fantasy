import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import NavBar from "./NavBar"

const AddToTeam = () => {
  const { leagueId } = useParams();
  const [userTeam, setUserTeam] = useState(null);
  const [playerToAdd, setPlayerToAdd] = useState('');
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/teams/userTeam/${userId}/${leagueId}`);
        
        if (!response.ok) {
          console.error('Error fetching user team:', response.statusText);
          navigate('/your-leagues');
          return;
        }

        const teamData = await response.json();
        setUserTeam(teamData.data);
      } catch (error) {
        console.error('Error fetching user team:', error.message);
      }
    };

    fetchUserTeam();
  }, [userId, leagueId, navigate]);

  const handleAddPlayer = async () => {
    try {
  
      // Check for valid integer value
      if (isNaN(parseInt(playerToAdd, 10))) {
        alert('Invalid player ID. Please enter a valid integer player ID.');
        return;
      }
  
      // Fetch all teams in the league
      const leagueTeamsResponse = await fetch(`http://localhost:4000/api/leagues/${leagueId}`);
      if (!leagueTeamsResponse.ok) {
        console.error('Error fetching league teams:', leagueTeamsResponse.statusText);
        return;
      }
  
      const leagueTeamsData = await leagueTeamsResponse.json();
      const playersList = leagueTeamsData.data.players;
      console.log(playersList)
  
      // Check for duplicate player ID in other teams in the league
      if (checkDuplicatePlayerInLeague(playersList, playerToAdd)) {
        alert('Player ID already exists in another team in the league. Please enter a unique player ID.');
        return;
      }
  
      // Make a request to your custom API endpoint to update the team with the added player
      console.log(userTeam._id)
      const response = await fetch(`http://localhost:4000/api/teams/${userTeam._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          players: [playerToAdd],
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error adding player: ${errorData.message}`);
        return;
      }
  
      // Fetch league details to get the updated turn
      const leagueResponse = await fetch(`http://localhost:4000/api/leagues/${leagueId}`);
      if (!leagueResponse.ok) {
        console.error('Error fetching league details:', leagueResponse.statusText);
        return;
      }
  
      const leagueData = await leagueResponse.json();
      const turn = leagueData.data.turn;
      const user_ids = leagueData.data.user_ids;
      console.log((turn + 1) % user_ids.length);
      // Update the turn based on your conditions
      if (turn < user_ids.length) {
        // Make a request to update the league document with the new turn
        await fetch(`http://localhost:4000/api/leagues/${leagueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            turn: (turn + 1) % user_ids.length,
            players: [...leagueData.data.players,playerToAdd]
          }),
        });
      }

      // Update the turn based on your conditions
      if (leagueData.data.players.length === 7*user_ids.length-1) {
        // Make a request to update the league document with the new turn
        await fetch(`http://localhost:4000/api/leagues/${leagueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            end: true
          }),
        });
      }
  
  
      // Redirect to Your Leagues page or wherever you want after adding the player
      navigate(`/league-details/${leagueId}`);
    } catch (error) {
      console.error('Error adding player:', error.message);
    }
  };
  
  // Helper function to check for duplicate player in all teams in the league
  const checkDuplicatePlayerInLeague = (players, player) => {
    for (const p of players) {
      if (p === parseInt(player)) {
        return true;
      }
    }
    return false;
  };
  

  return (
    <div>
      <NavBar />
      <div className='main_item'>
      {userTeam ? (
        <div>
          <h2>Add to Team</h2>
          <p>Current Team:</p>
          <ul>
            {userTeam.players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <label>
            Player to Add:
            <input type="text" value={playerToAdd} onChange={(e) => setPlayerToAdd(e.target.value)} />
          </label>
          <button className='standard_button' onClick={handleAddPlayer}>Add Player</button>
        </div>
      ) : (
        <p>Loading team details...</p>
      )}
      </div>
    </div>
  );
};

export default AddToTeam;
