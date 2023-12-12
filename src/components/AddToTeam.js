import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { auth } from '../firebase';
import NavBar from "./NavBar"
import PlayerSearch from './PlayerSearch';
// import "./PlayerDetails.scss"

const AddToTeam = () => {
  const { leagueId } = useParams();
  const [userTeam, setUserTeam] = useState(null);
  const [userTeamDetail, setUserTeamDetail] = useState([]);
  const [playerToAdd, setPlayerToAdd] = useState('');
  const [message, setMessage] = useState('')
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const response = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/teams/userTeam/${userId}/${leagueId}`);
        
        if (!response.ok) {
          console.error('Error fetching user team:', response.statusText);
          navigate('/your-leagues');
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
        setUserTeamDetail(temp || []);
        setUserTeam(teamData.data);
      } catch (error) {
        console.error('Error fetching user team:', error.message);
      }
    };

    fetchUserTeam();
  }, [userId, leagueId, navigate]);

  const handleAddPlayer = async () => {
    try {
  
      // Check for valid integer value
      if (isNaN(parseInt(playerToAdd, 10))) {
        document.getElementById('message').style.color = 'red'
        setMessage('Invalid player ID. Please enter a valid integer player ID.')
        return;
      }
  
      // Fetch all teams in the league
      const leagueTeamsResponse = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues/${leagueId}`);
      if (!leagueTeamsResponse.ok) {
        console.error('Error fetching league teams:', leagueTeamsResponse.statusText);
        return;
      }
  
      const leagueTeamsData = await leagueTeamsResponse.json();
      const playersList = leagueTeamsData.data.players;
      console.log(playersList)
  
      // Check for duplicate player ID in other teams in the league
      if (checkDuplicatePlayerInLeague(playersList, playerToAdd)) {
        document.getElementById('message').style.color = 'red'
        setMessage('Player ID already exists in another team in the league. Please enter a unique player ID.')
        return;
      }
  
      // Make a request to your custom API endpoint to update the team with the added player
      console.log(userTeam._id)
      const response = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/teams/${userTeam._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          players: [playerToAdd],
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        document.getElementById('message').style.color = 'red'
        setMessage(`Error adding player: ${errorData.message}`)
        return;
      }
  
      // Fetch league details to get the updated turn
      const leagueResponse = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues/${leagueId}`);
      if (!leagueResponse.ok) {
        console.error('Error fetching league details:', leagueResponse.statusText);
        return;
      }
  
      const leagueData = await leagueResponse.json();
      const turn = leagueData.data.turn;
      const user_ids = leagueData.data.user_ids;
      console.log((turn + 1) % user_ids.length);
      // Update the turn based on your conditions
      if (turn < user_ids.length) {
        // Make a request to update the league document with the new turn
        await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues/${leagueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            turn: (turn + 1) % user_ids.length,
            players: [...leagueData.data.players,playerToAdd]
          }),
        });
      }

      // Update the turn based on your conditions
      if (leagueData.data.players.length === 7*user_ids.length-1) {
        // Make a request to update the league document with the new turn
        await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues/${leagueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            end: true
          }),
        });
      }
  
  
      // Redirect to Your Leagues page or wherever you want after adding the player
      navigate(`/league-details/${leagueId}`);
    } catch (error) {
      console.error('Error adding player:', error.message);
    }
  };
  
  // Helper function to check for duplicate player in all teams in the league
  const checkDuplicatePlayerInLeague = (players, player) => {
    for (const p of players) {
      if (p === parseInt(player)) {
        return true;
      }
    }
    return false;
  };
  

  return (
    <div>
      <NavBar />
      <PlayerSearch />
      <div className='main_item'>
      {userTeam ? (
        <div>
          <h2>Add to Team</h2>
          <p>Current Team:</p>
          <div className='currplayersadd'>
          {/* <ul> */}
            {userTeamDetail.map((player) => (
              // <li key={player.id}>
                <div className='playerinfo'><b>{player.name}</b><br/>{player.team}<br/>(Pts: {player.pts}, Ast: {player.ast}, Reb: {player.reb})</div>
              // </li>
            ))}
          {/* </ul> */}
          </div>
          <div className='extra_space'>
            <label className='extra_space'>
              Player to Add:  
            </label>
            <input type="text" value={playerToAdd} onChange={(e) => setPlayerToAdd(e.target.value)} />
          </div>
          <button className='standard_button' onClick={handleAddPlayer}>Add Player</button>
          <p id="message">{message}</p>
        </div>
      ) : (
        <p>Loading team details...</p>
      )}
      </div>
    </div>
  );
};

export default AddToTeam;
