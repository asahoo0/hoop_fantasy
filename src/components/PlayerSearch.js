import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { filterCurrent } from './id';
import "./PlayerList.scss"

const PlayerSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const checkForSearchEnter = async (e) => {
        if(e.key == 'Enter')
            await handleSearch();
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
    const formatPlayerName = (player) => {
        return `${player.id} ${player.first_name} ${player.last_name}`;
    };

        const resetPlayers = () => {
        setPlayers([]);
        setSearchTerm("");
    }

    return (
        <div className='main_item'>
            <div>
                <h1>Create Team</h1>
                <h3>To add a player to your team, search their name below, then type the the ID number next to their name into the "Player to Add" text field and click "Add Player".</h3>
                <div className='player_search'>
                    <label className='player_search'>Search For Players:</label>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onKeyUp={(e) => checkForSearchEnter(e)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className='player_search' disabled = {!searchTerm} onClick={handleSearch}>Search</button>
                    <button className='player_search' onClick={resetPlayers}>Clear</button>
                </div>
            </div>
                <ul className='player_search'>
                  {players.map(player => (
                    <li key={player.id}><b>{formatPlayerName(player)}</b></li>
                  ))}
            </ul>
        </div>
    );
}

export default PlayerSearch;