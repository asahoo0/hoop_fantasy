import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const AddToTeam = () => {
  const { leagueId } = useParams();
  const [userTeam, setUserTeam] = useState(null);
  const [playersToAdd, setPlayersToAdd] = useState('');
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const teamsCollectionRef = collection(db, 'teams');
        const userTeamQuery = query(teamsCollectionRef, where('user_id', '==', userId, '&&', 'league_id', '==', leagueId));
        const teamSnapshot = await getDocs(userTeamQuery);

        if (teamSnapshot.docs.length === 0) {
          console.error('User does not have a team in this league.');
          navigate('/your-leagues'); // Redirect to Your Leagues if the user doesn't have a team in this league
          return;
        }

        const teamData = teamSnapshot.docs[0].data();
        setUserTeam(teamData);
      } catch (error) {
        console.error('Error fetching user team:', error.message);
      }
    };

    fetchUserTeam();
  }, [userId, leagueId, navigate]);

  const handleAddPlayers = async () => {
    try {
      const playersToAddArray = playersToAdd.split(',').map(player => player.trim());
  
      // Check for duplicate player IDs
      if (hasDuplicates([...userTeam.players, ...playersToAddArray])) {
        alert('Duplicate player IDs detected. Please enter unique player IDs.');
        return;
      }
  
      // Check for valid integer values
      if (playersToAddArray.some(player => isNaN(parseInt(player, 10)))) {
        alert('Invalid player IDs. Please enter valid integer player IDs.');
        return;
      }
  
      const updatedPlayers = userTeam.players.concat(playersToAddArray);
  
      const teamsCollectionRef = collection(db, 'teams');
  
      // Find the team using the combination of league_id and user_id
      const teamQuery = query(
        teamsCollectionRef,
        where('league_id', '==', leagueId),
        where('user_id', '==', userId)
      );
  
      const teamSnapshot = await getDocs(teamQuery);
  
      if (teamSnapshot.empty) {
        console.error('User does not have a team in this league.');
        navigate('/your-leagues'); // Redirect to Your Leagues if the user doesn't have a team in this league
        return;
      }
  
      const teamDocRef = doc(teamsCollectionRef, teamSnapshot.docs[0].id);
  
      await updateDoc(teamDocRef, { players: updatedPlayers });
  
      // Redirect to Your Leagues page or wherever you want after adding players
      navigate('/your-leagues');
    } catch (error) {
      console.error('Error adding players:', error.message);
    }
  };
  
  

  // Helper function to check for duplicate values in an array
  const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  };

  return (
    <div>
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
            Players to Add (comma-separated):
            <input type="text" value={playersToAdd} onChange={(e) => setPlayersToAdd(e.target.value)} />
          </label>
          <button onClick={handleAddPlayers}>Add Players</button>
        </div>
      ) : (
        <p>Loading team details...</p>
      )}
    </div>
  );
};

export default AddToTeam;
