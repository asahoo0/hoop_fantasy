import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Adjust the path accordingly
import { collection, addDoc } from 'firebase/firestore';

// Function to generate a random join code (for demonstration purposes)
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
      const user = auth.currentUser; // Get the current authenticated user
      if (!user) {
        // Handle the case where the user is not authenticated
        alert('User not authenticated');
        return;
      }

      const creatorUID = user.uid;

      // Generate a random join code
      const joinCode = generateJoinCode();

      const leaguesCollectionRef = collection(db, 'leagues');

      const newLeagueDocRef = await addDoc(leaguesCollectionRef, {
        name: leagueName,
        participants: [creatorUID],
        joinCode: joinCode, // Include the join code in the league document
        teams: []
      });

      // Use alert to notify the user that the league was created
      alert(`League created successfully with ID: ${newLeagueDocRef.id} and Join Code: ${joinCode}`);

      // You can add additional logic or redirect the user after league creation
    } catch (error) {
      // Use alert to notify the user of any errors
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
