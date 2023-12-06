import React, { useState } from 'react';
import { auth } from '../firebase'; // Adjust the path accordingly

const JoinLeagueForm = () => {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinLeague = async (e) => {
    e.preventDefault();
  
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('User not authenticated');
        return;
      }
  
      const userUID = user.uid;
  
      // Replace the Firestore query with your API call to get the leagueId
      const response = await fetch(`http://localhost:4000/api/leagues/getLeagueId/${joinCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error joining league: ${errorData.message}`);
        return;
      }
  
      const leagueData = await response.json();
      const leagueId = leagueData.data.leagueId;
  
      // Fetch the existing league data
      const existingLeagueResponse = await fetch(`http://localhost:4000/api/leagues/${leagueId}/addUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userUID,
        }),
      });
  
      if (!existingLeagueResponse.ok) {
        const errorData = await existingLeagueResponse.json();
        alert(`Error joining league: ${errorData.message}`);
        return;
      }
  
      // Now you've successfully joined the league
      alert(`You have joined the league successfully! League ID: ${leagueId}`);
      // You can add additional logic or redirect the user after joining the league
    } catch (error) {
      alert(`Error joining league: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleJoinLeague}>
      <label>
        Join Code:
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
      </label>
      <button type="submit">Join League</button>
    </form>
  );
};

export default JoinLeagueForm;