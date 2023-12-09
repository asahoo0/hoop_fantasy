//Select 5 and calculate score -> remember to update the total in league details later
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Scoring = () => {
  const { leagueId } = useParams();
  const [userTeam, setUserTeam] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert('User not authenticated');
          return;
        }

        const response = await fetch(`http://localhost:4000/api/teams/userTeam/${user.uid}/${leagueId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error fetching user team: ${errorData.message}`);
          return;
        }

        const teamData = await response.json();
        setUserTeam(teamData.data.players || []);
        setLoading(false);
      } catch (error) {
        alert(`Error fetching user team: ${error.message}`);
      }
    };

    fetchUserTeam();
  }, [leagueId]);

  const handlePlayerClick = (playerId) => {
    // Check if the player is already selected
    if (selectedPlayers.includes(playerId)) {
      // Player is already selected, remove from the list
      setSelectedPlayers((prevSelected) => prevSelected.filter((id) => id !== playerId));
    } else {
      // Player is not selected, add to the list (limit to 5 players)
      if (selectedPlayers.length < 5) {
        setSelectedPlayers((prevSelected) => [...prevSelected, playerId]);
      }
    }
  };

  const handleScoringSubmit = () => {
    // Perform any actions needed with the selected players
    console.log('Selected Players:', selectedPlayers);
    // You can navigate to another page or perform scoring logic here
  };

  return (
    <div>
      <h2>Player Scoring</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Select 5 players from your team:</p>
          <ul>
            {userTeam.map((player) => (
              <li
                key={player.id}
                onClick={() => handlePlayerClick(player.id)}
                className={selectedPlayers.includes(player.id) ? 'selected' : ''}
              >
                {`Player ID: ${player.id}, Name: ${player.name}`}
              </li>
            ))}
          </ul>
          <button onClick={handleScoringSubmit} disabled={selectedPlayers.length !== 5}>
            Submit Scoring
          </button>
        </div>
      )}
    </div>
  );
};

export default Scoring;
