import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://www.balldontlie.io/api/v1/players?page=${currentPage}&per_page=10`);
        setPlayers(response.data.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [currentPage]);

  const formatPlayerName = (player) => {
    return `${player.id}. ${player.first_name} ${player.last_name}`;
  };

  return (
    <div>
      <NavBar />
      <div className='main_item'>
        <h1>Ball Don't Lie Player List</h1>
        <button className="standard_button" onClick = {() => navigate("/your-leagues")}>Back to Your Leagues</button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <ul>
              {players.map(player => (
                <li key={player.id}>{formatPlayerName(player)}</li>
              ))}
            </ul>
            {/* Add pagination controls here */}
            <button className="standard_button" onClick={() => setCurrentPage(prevPage => prevPage + 1)}>Next Page</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerList;