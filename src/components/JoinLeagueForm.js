import React, { useState } from 'react';
import { auth } from '../firebase'; // Adjust the path accordingly
import NavBar from './NavBar';

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

      const leagueInfoResponse = await fetch(`http://localhost:4000/api/leagues/${leagueId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!leagueInfoResponse.ok) {
        const errorData = await leagueInfoResponse.json();
        alert(`Error fetching league information: ${errorData.message}`);
        return;
      }

      const leagueInfo = await leagueInfoResponse.json();

      // Check if the draft has started
      if (leagueInfo.data.start) {
        alert('Sorry, the draft has already started. You cannot join the league.');
        return;
      }
  
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
    <div>
      <NavBar />
      <div className='main_item'>
        <form onSubmit={handleJoinLeague} className='league'>
          <label>
            <span className="league_name_span">Join Code:</span>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </label>
          <button className="league" type="submit">Join League</button>
        </form>
      </div>
    </div>
  );
};

export default JoinLeagueForm;