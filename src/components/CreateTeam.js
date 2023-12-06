import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const CreateTeam = () => {
  const { leagueId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [player, setPlayer] = useState('');
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    try {
      // Validate player input
      if (!player) {
        alert('Please enter a player ID.');
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
      if (checkDuplicatePlayerInLeague(playersList, player)) {
        alert('Player ID already exists in another team in the league. Please enter a unique player ID.');
        return;
      }
  
      // Make a request to your backend API to create a new team
      const response = await fetch('http://localhost:4000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teamName,
          players: [player], // Ensure only one player is added
          league_id: leagueId,
          user_id: userId,
          score: 0,
          // Add any other fields you need based on your Mongoose schema
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error creating team: ${errorData.message}`);
        return;
      }
  
      // Extract the team ID from the response
      const teamData = await response.json();
      const newTeamId = teamData.data._id; // Adjust based on your actual response structure
  
      // Make a request to update the league document with the new team's ID
      await fetch(`http://localhost:4000/api/leagues/${leagueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teams: [newTeamId]
        }),
      });
  
      // Fetch league details to get the updated turn
      const leagueResponse = await fetch(`http://localhost:4000/api/leagues/${leagueId}`);
      if (!leagueResponse.ok) {
        console.error('Error fetching league details:', leagueResponse.statusText);
        return;
      }
  
      const leagueData = await leagueResponse.json();
      const turn = leagueData.data.turn;
      const user_ids = leagueData.data.user_ids; 
      console.log((turn + 1) % user_ids.length)
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
            players: [...leagueData.data.players,player]
          }),
        });
      }
  
      // Redirect to Your Leagues page or wherever you want after creating the team
      navigate('/your-leagues');
    } catch (error) {
      console.error('Error creating team:', error.message);
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
      <h1>Create Team</h1>
      <label>
        Team Name:
        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
      </label>
      <label>
        Player ID:
        <input type="text" value={player} onChange={(e) => setPlayer(e.target.value)} />
      </label>
      <button onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default CreateTeam;
