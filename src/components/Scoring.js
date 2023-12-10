import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Scoring = () => {
  const { leagueId } = useParams();
  const [userTeam, setUserTeam] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          document.getElementById('message').style.color = 'red'
          setMessage('User not authenticated')
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
          document.getElementById('message').style.color = 'red'
          setMessage(`Error fetching user team: ${errorData.message}`)
          return;
        }

        const teamData = await response.json();
        setUserTeam(teamData.data.players || []);
        setLoading(false);
      } catch (error) {
        document.getElementById('message').style.color = 'red'
        setMessage(`Error fetching user team: ${error.message}`)
      }
    };

    fetchUserTeam();
  }, [leagueId]);

  const handlePlayerClick = (playerNumber) => {
    // Check if the player is already selected
    if (selectedPlayers.includes(playerNumber)) {
      // Player is already selected, remove from the list
      setSelectedPlayers((prevSelected) => prevSelected.filter((number) => number !== playerNumber));
    } else {
      // Player is not selected, add to the list (limit to 5 players)
      if (selectedPlayers.length < 5) {
        setSelectedPlayers((prevSelected) => [...prevSelected, playerNumber]);
      }
    }
  };
  const calculatePlayerScore = (playerData) => {
    const { pts, ast, reb, stl, blk } = playerData;

    const playerScore = (1.5 * pts) + (2 * ast) + (1.5 * reb) + (3 * stl) + (3 * blk);
    return playerScore;
  };

  const handleScoringSubmit = async () => {
    try {
      // Perform any actions needed with the selected players
      console.log('Selected Players:', selectedPlayers);

      // Make a request to the balldontlie API with selected player IDs
      const playerIdsQueryParam = selectedPlayers.map((playerId) => `player_ids[]=${playerId}`).join('&');
      const response = await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2023&${playerIdsQueryParam}`);

      if (!response.ok) {
        console.error('Error fetching season averages:', response.statusText);
        return;
      }

      const seasonAveragesData = await response.json();
      console.log('Season Averages Data:', seasonAveragesData);
      const playerScores = seasonAveragesData.data.map(calculatePlayerScore);

      console.log('Player Scores:', playerScores);

      // Calculate the total score for the team
      const totalScore = playerScores.reduce((sum, score) => sum + score, 0);
      const user = auth.currentUser;

      // Update the total score in the backend
      const updateScoreResponse = await fetch(`http://localhost:4000/api/teams/updateScore/${user.uid}/${leagueId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ score: totalScore.toFixed(2) }), // Make sure the field name matches what the backend expects
});

      if (!updateScoreResponse.ok) {
        console.error('Error updating team score:', updateScoreResponse.statusText);
        return;
      }

      console.log('Team score updated successfully.');

      // You can navigate to another page or perform further logic here
      navigate(`/league-details/${leagueId}`);
    } catch (error) {
      console.error('Error submitting scoring:', error.message);
    }
  };

  return (
    <div>
      <h2>Player Scoring</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Select 5 players from your team:</p>
          <div className="player-buttons">
            {userTeam.map((playerNumber) => (
              <button
                key={playerNumber}
                onClick={() => handlePlayerClick(playerNumber)}
                className={selectedPlayers.includes(playerNumber) ? 'selected' : ''}
              >
                {`Player ${playerNumber}`}
              </button>
            ))}
          </div>
          <button onClick={handleScoringSubmit} disabled={selectedPlayers.length !== 5}>
            Submit Scoring
          </button>
        </div>
      )}
      <p id="message">{message}</p>
    </div>
  );
};

export default Scoring;
