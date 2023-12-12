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
  const [message, setMessage] = useState('')

  const handleCreateLeague = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        document.getElementById('message').style.color = 'red'
        setMessage('User not authenticated')
        return;
      }
  
      const creatorUID = user.uid;
      const joinCode = generateJoinCode();
  
      const response = await fetch('https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues', {
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
        document.getElementById('message').style.color = 'red'
        setMessage(`Error creating league: ${errorData.message}`)
        return;
      }
  
      const leagueData = await response.json();
      const leagueID = leagueData.data._id;
  
      await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues/${leagueID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_ids: [creatorUID],
        }),
      });
  
      document.getElementById('message').style.color = 'lightgreen'
      setMessage([`League created successfully`,<br/>,`Join Code: ${joinCode}`])
    } catch (error) {
      document.getElementById('message').style.color = 'red'
      setMessage(`Error creating league: ${error.message}`)
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
        <p id='message'>{message}</p>
      </div>
    </div>
  );
};

export default CreateLeagueForm;
