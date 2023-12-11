import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';
import NavBar from './NavBar';

const Scoring = () => {
  const { leagueId } = useParams();
  const [userTeam, setUserTeam] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('')
  const navigate = useNavigate();
  const remainingPlayers = userTeam.filter(player => !selectedPlayers.includes(player));

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          document.getElementById('message').style.color = 'red'
          setMessage('User not authenticated')
          return;
        }

        const response = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/teams/userTeam/${user.uid}/${leagueId}`, {
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
        let temp = []
        for (const player of teamData.data.players) {
          try {
            const resplayer = await axios.get(`https://www.balldontlie.io/api/v1/players/${player}`);
            
            const info = resplayer.data
            // console.log(info)
            let content = {id: player, name: `${info.first_name} ${info.last_name}`, team: info.team.full_name, pts: 0, ast: 0, reb: 0, st: 0, blk: 0};
            // console.log(content);
            temp.push(content);
          } catch (error) {
            console.error(`Error fetching data for ID ${player}:`, error.message);
            // Handle errors if necessary
          }
        }
        try {
          const playerIdsQueryParam = temp.map((player) => `player_ids[]=${player.id}`).join('&');
          const resStats = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2023&${playerIdsQueryParam}`);
          console.log(resStats.data.data);
          resStats.data.data.forEach(stat => {
            const playerToUpdate = temp.find(player => player.id === stat.player_id);
            if (playerToUpdate) {
              playerToUpdate.pts = stat.pts;
              playerToUpdate.ast = stat.ast;
              playerToUpdate.blk = stat.blk;
              playerToUpdate.stl = stat.stl;
              playerToUpdate.reb = stat.reb;
            }
          })
        } catch (error) {

        }
        console.log(temp)
        setUserTeam(temp || []);
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
    console.log(selectedPlayers);
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
      // const playerIdsQueryParam = selectedPlayers.map((playerId) => `player_ids[]=${playerId}`).join('&');
      // const response = await fetch(`https://www.balldontlie.io/api/v1/season_averages?season=2023&${playerIdsQueryParam}`);

      // if (!response.ok) {
      //   console.error('Error fetching season averages:', response.statusText);
      //   return;
      // }

      // const seasonAveragesData = await response.json();
      // console.log('Season Averages Data:', seasonAveragesData);
      const playerScores = selectedPlayers.map(calculatePlayerScore);

      console.log('Player Scores:', playerScores);
      const custompts = document.getElementById("pts").value;
      const customast = document.getElementById("ast").value;
      const customreb = document.getElementById("reb").value;
      const customblk = document.getElementById("blk").value;
      const customstl = document.getElementById("stl").value;
      const customPlayer = {pts: custompts, ast: customast, reb: customreb, blk: customblk, stl: customstl}
      const customPlayerScore = calculatePlayerScore(customPlayer);
      // Calculate the total score for the team
      const totalplayerScores = playerScores.reduce((sum, score) => sum + score, 0);
      const totalScore =  totalplayerScores + customPlayerScore;
      console.log(totalScore, totalplayerScores, customPlayerScore);
      const user = auth.currentUser;

      // Update the total score in the backend
      const updateScoreResponse = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/teams/updateScore/${user.uid}/${leagueId}`, {
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
      <NavBar />
      <h1>Player Scoring</h1>
      <h2>Select 5 players from your team:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="Scoring">
          <div className="player-buttons">
            {userTeam.map((player) => (
              <button
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className={selectedPlayers.includes(player) ? 'selected' : ''}
              >
                <h2>{`${player.name}`}</h2>
                <p>Team: {player.team} <br/>Pts: {player.pts} <br/>Ast: {player.ast}<br/>Reb: {player.reb}<br/>Stl: {player.stl}, Blk: {player.blk}</p>
              </button>
            ))}
          </div>
          <button onClick={handleScoringSubmit} disabled={selectedPlayers.length !== 5}>
            Submit Scoring
          </button>
        </div>
      )}
      
      {/* Display the remaining/not selected players outside the Scoring div */}
      
      {!loading && selectedPlayers.length === 5 ? (
        <div className='customplayer'>
          <h2>Now, select which players to use for your custom player: </h2>
          <select id="pts" onChange={(e) => console.log(e.target.value)}>
              {remainingPlayers.map((player) => (
                <option value={player.pts}>{player.name}</option>
              ))}
          </select>
          <select id="ast" onChange={(e) => console.log(e.target.value)}>
            {remainingPlayers.map((player) => (
                <option value={player.ast}>{player.name}</option>
              ))}
          </select>
          <select id="reb" onChange={(e) => console.log(e.target.value)}>
            {remainingPlayers.map((player) => 
                (<option value={player.reb}>{player.name}</option>)
              )}
          </select>
          <select id="blk" onChange={(e) => console.log(e.target.value)}>
              {remainingPlayers.map((player) => 
               ( <option value={player.blk}>{player.name}</option>)
              )}
          </select>
          <select id="stl" onChange={(e) => console.log(e.target.value)}>
              {remainingPlayers.map((player) => 
                (<option value={player.stl}>{player.name}</option>)
              )}
          </select>
        </div>
      ): (<div></div>)}
      {/* {!loading && (
        <div className="remaining-players">
          <p>Remaining Players:</p>
          {remainingPlayers.map((player) => (
            <p key={player.id}>{`${player.name}`}</p>
          ))}
        </div>
          )*/}
      <p id="message">{message}</p>
    </div>
  );
};

export default Scoring;
