import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

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
    <form onSubmit={handleCreateLeague}>
      <label>
        League Name:
        <input
          type="text"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
        />
      </label>
      <button type="submit">Create League</button>
    </form>
  );
};

export default CreateLeagueForm;
