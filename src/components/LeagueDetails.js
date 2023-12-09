import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import NavBar from './NavBar';
import Leaderboard from './Leaderboard';
import Scoring from './Scoring'; // Import the Scoring component

const LeagueDetails = () => {
  const { leagueId } = useParams();
  const [team, setTeamExists] = useState(false);
  const [draftStarted, setDraftStarted] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [draftEnded, setDraftEnded] = useState(false);
  const [teamScored, setTeamScored] = useState(false); // New state for teamScored
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const draftResponse = await fetch(`http://localhost:4000/api/leagues/${leagueId}`);
        if (!draftResponse.ok) {
          console.error('Error fetching league details:', draftResponse.start);
          return;
        }

        const draftData = await draftResponse.json();
        setDraftStarted(draftData.data.start || false);
        setDraftEnded(draftData.data.end || false);

        const isUserTurn = draftData.data.user_ids && draftData.data.user_ids[draftData.data.turn] === userId;
        setIsUserTurn(isUserTurn);

        const teamsResponse = await fetch(`http://localhost:4000/api/teams/userTeam/${userId}/${leagueId}`);
        if (!teamsResponse.ok) {
          console.error('Error fetching user teams:', teamsResponse.statusText);
          return;
        }

        const teamsData = await teamsResponse.json();
        const userTeamInLeague = teamsData.data;
        setTeamExists(!!userTeamInLeague);

        // Check if the team has already scored
        setTeamScored(userTeamInLeague.score > 0);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [leagueId, userId]);

  const handleStartDraft = async () => {
    try {
      if (draftStarted) {
        console.log('Draft has already started.');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/leagues/${leagueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start: true }),
      });

      if (!response.ok) {
        console.error('Error starting draft:', response.statusText);
        return;
      }

      setDraftStarted(true);
    } catch (error) {
      console.error('Error starting draft:', error.message);
    }
  };

  const handleCreateTeam = () => {
    navigate(`/create-team/${leagueId}`);
  };

  const handleAddPlayer = () => {
    navigate(`/add-to-team/${leagueId}`);
  };

  const handleScoring = () => {
    navigate(`/scoring/${leagueId}`); // Link to the Scoring component with leagueId as a param
  };

return (
  <div>
    <NavBar />
    <div className="main_item league-details-container">
      <div className="league-details">
        <h2>League Details</h2>
        {team ? (  // Check if the user has a team in the league
          <div>
            <p>You have a team in this league.</p>
            {draftEnded ? (  // Check if the draft has ended
              <div>
                <p>The draft has ended.</p>
                {teamScored ? (  // Check if the team has already scored
                  <p>Team has already scored.</p>
                ) : (
                  <button className="standard_button" onClick={handleScoring}>Scoring</button>
                )}
              </div>
            ) : (
              <>  {/* Conditional rendering for draft state */}
                {draftStarted ? (
                  isUserTurn ? (
                    <button className="standard_button" onClick={handleAddPlayer}>Add a Player</button>
                  ) : (
                    <div>
                      <p>It's not your turn to draft.</p>
                    </div>
                  )
                ) : (
                  <div>
                    <p>Draft has not started. You cannot add a player yet.</p>
                    {isUserTurn && (
                      <button className="standard_button" onClick={handleStartDraft}>Start Draft</button>
                    )}
                  </div>
                )}
              </>
            )}
            {<button className='standard_button' onClick={() => navigate(`/player-list/${leagueId}`)}>View Player List</button>}
          </div>
        ) : (
          <div>
            <p>You don't have a team in this league.</p>
            {draftEnded ? (
              <div>
                <p>The draft has ended.</p>
                {teamScored ? (
                  <p>Team has already scored.</p>
                ) : (
                  <button className="standard_button" onClick={handleScoring}>Scoring</button>
                )}
              </div>
            ) : (
              <>  {/* Conditional rendering for draft state */}
                {draftStarted ? (
                  isUserTurn ? (
                    <>
                      <p>Create a team with one player to get started.</p>
                      <button className='standard_button' onClick={handleCreateTeam}>Create Team</button>
                    </>
                  ) : (
                    <div>
                      <p>It's not your turn to draft.</p>
                    </div>
                  )
                ) : (
                  <div>
                    <p>Draft has not started. You cannot create a team yet.</p>
                    {(
                      <button className='standard_button' onClick={handleStartDraft}>Start Draft</button>
                    )}
                  </div>
                )}
              </>
            )}
            {<button className='standard_button' onClick={() => navigate(`/player-list/${leagueId}`)}>View Player List</button>}
          </div>
        )}
      </div>
      <div className="leaderboard">
        <Leaderboard leagueId={leagueId} />
      </div>
    </div>
  </div>
);

};

export default LeagueDetails;
