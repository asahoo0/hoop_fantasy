import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import NavBar from './NavBar';

const generateJoinCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let joinCode = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    joinCode += characters.charAt(randomIndex);
  }
  return joinCode;
};

const CreateLeagueForm = () => {
  const [leagueName, setLeagueName] = useState('');

  const handleCreateLeague = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('User not authenticated');
        return;
      }
  
      const creatorUID = user.uid;
      const joinCode = generateJoinCode();
  
      const response = await fetch('http://localhost:4000/api/leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leagueName,
          join_code: joinCode,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error creating league: ${errorData.message}`);
        return;
      }
  
      const leagueData = await response.json();
      const leagueID = leagueData.data._id;
  
      await fetch(`http://localhost:4000/api/leagues/${leagueID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_ids: [creatorUID],
        }),
      });
  
      alert(`League created successfully with ID: ${leagueID} and Join Code: ${joinCode}`);
    } catch (error) {
      alert(`Error creating league: ${error.message}`);
    }
  };
  

  return (
    <div>
      <NavBar />
      <div className='main_item'>
        <form onSubmit={handleCreateLeague} className="league">
          <label>
            <span className="league_name_span">League Name:</span>
            <input
              type="text"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
            />
          </label>
          <button disabled = {!leagueName} className="standard_button league" type="submit">Create League</button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeagueForm;
