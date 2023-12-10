import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { filterCurrent } from './id';
import "./PlayerList.scss"

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  
  const navigate = useNavigate();
  // useEffect(() => {
  //   const fetchPlayers = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`https://www.balldontlie.io/api/v1/players?page=${currentPage}&per_page=10`);
  //       // const response = await axios.get(`https://www.balldontlie.io/api/v1/players?search=`);
  //       // const response1 = await axios.get('https://www.balldontlie.io/api/v1/season_averages?season=2023')
  //       // console.log(responsetest)
  //       // console.log(response1)
  //       setPlayers(response.data.data);
  //     } catch (error) {
  //       console.error('Error fetching players:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPlayers();
  // }, [currentPage]);

  const formatPlayerName = (player) => {
    return `${player.id}. ${player.first_name} ${player.last_name}`;
  };
  const handleSearch = async () => {
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${searchTerm}&per_page=100`)
      .then((res)=>{
        console.log(res.data.data)
        setPlayers(filterCurrent(res.data.data))
        setLoading(false);
      })
      .catch((error)=>{
        console.log(error);
      });
  };
  return (
    <div>
      <NavBar />
      <div className='main_item'>
        <h1>Ball Don't Lie Player List</h1>
        <button className="standard_button" onClick = {() => navigate("/your-leagues")}>Back to Your Leagues</button>
        <div>
          <h1>Search For Players</h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search" onClick={handleSearch}>Search</button>
        </div>
          <div class="list">
            {loading ? (
              <div></div>
              // <p>Loading...</p>
            ) : (
              <>
                <ul>
                  {players.map(player => (
                    <li key={player.id}>{formatPlayerName(player)}</li>
                  ))}
                </ul>
                {/* Add pagination controls here
                <button className="standard_button" onClick={() => setCurrentPage(prevPage => prevPage + 1)}>Next Page</button> */}
              </>
            )}
          </div>
      </div>
    </div>
  );
};

export default PlayerList;
