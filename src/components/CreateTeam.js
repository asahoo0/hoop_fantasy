import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, getDoc, updateDoc, doc } from 'firebase/firestore';

const CreateTeam = () => {
  const { leagueId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState('');
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    try {
      // Convert player IDs to integers
      const playerIds = players.split(',').map(player => parseInt(player.trim(), 10));
  
      // Check if there are duplicate player IDs
      if (hasDuplicates(playerIds)) {
        alert('Duplicate player IDs detected. Please enter unique player IDs.');
        return;
      }
  
      // Create a new team
      const teamsCollectionRef = collection(db, 'teams');
      const newTeamRef = await addDoc(teamsCollectionRef, {
        name: teamName,
        players: playerIds,
        league_id: leagueId,
        user_id: userId,
      });
  
      const newTeamId = newTeamRef.id;
  
      // Fetch existing teams array from the league document
      const leaguesCollectionRef = collection(db, 'leagues');
      const leagueDocRef = doc(leaguesCollectionRef, leagueId);
      const leagueDoc = await getDoc(leagueDocRef);
      const existingTeams = leagueDoc.data().teams || []; // Use the existing teams array, default to an empty array if not present
  
      // Update the league document to include the new team's ID in the teams array
      await updateDoc(leagueDocRef, {
        teams: [...existingTeams, newTeamId],
      });
  
      // Redirect to Your Leagues page or wherever you want after creating the team
      navigate('/your-leagues');
    } catch (error) {
      console.error('Error creating team:', error.message);
    }
  };
  
  // Helper function to check for duplicate values in an array
  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };
  
  return (
    <div>
      <h1>Create Team</h1>
      <label>
        Team Name:
        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
      </label>
      <label>
        Players (comma-separated):
        <input type="text" value={players} onChange={(e) => setPlayers(e.target.value)} />
      </label>
      <button onClick={handleCreateTeam}>Create Team</button>
    </div>
  );
};

export default CreateTeam;
