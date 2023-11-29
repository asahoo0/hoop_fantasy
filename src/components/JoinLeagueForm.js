import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Adjust the path accordingly
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const JoinLeagueForm = () => {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinLeague = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser; // Get the current authenticated user
      if (!user) {
        // Handle the case where the user is not authenticated
        alert('User not authenticated');
        return;
      }

      const userUID = user.uid

      // Query the Firestore database to find the league with the given join code
      const leaguesCollectionRef = collection(db, 'leagues');
      const q = query(leaguesCollectionRef, where('joinCode', '==', joinCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No league found with the provided join code
        alert('Invalid join code. Please check and try again.');
        return;
      }

      // Assuming there is only one league with the given join code
      const leagueDoc = querySnapshot.docs[0];
      const leagueId = leagueDoc.id;

      // Update the league document to add the user to the participants array
      const leagueRef = doc(db, 'leagues', leagueId);
      await updateDoc(leagueRef, {
        participants: [...leagueDoc.data().participants, userUID],
      });

      alert('You have joined the league successfully!');
      // You can add additional logic or redirect the user after joining the league
    } catch (error) {
      // Use alert to notify the user of any errors
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
