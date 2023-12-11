import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Leaderboard = () => {
  const { leagueId } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          document.getElementById('message').style.color = 'red'
          setMessage('User not authenticated')
          return;
        }

        const response = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/leagues/${leagueId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          document.getElementById('message').style.color = 'red'
          setMessage(`Error fetching league details: ${errorData.message}`)
          return;
        }

        const leagueData = await response.json();
        const teamIds = leagueData.data.team_ids || [];

        if (teamIds.length === 0) {
          // If teams don't exist, show the user's email with a score of 0
          setTeams([{ user_email: user.email, score: 0 }]);
          setLoading(false);
          return;
        }

        // Fetch details for each team
        const teamsWithDetails = await Promise.all(
          teamIds.map(async (teamId) => {
            const teamDetailsResponse = await fetch(`https://limitless-caverns-43471-220b25c991c2.herokuapp.com/api/teams/${teamId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!teamDetailsResponse.ok) {
              console.error(`Error fetching team details for team ${teamId}: ${teamDetailsResponse.statusText}`);
              return null;
            }

            const teamDetailsData = await teamDetailsResponse.json();
            return teamDetailsData.data;
          })
        );

        // Remove null entries (failed fetches) and set the teams state
        setTeams(teamsWithDetails.filter((team) => team !== null));
        setLoading(false);
      } catch (error) {
        document.getElementById('message').style.color = 'red'
        setMessage(`Error fetching teams: ${error.message}`)
      }
    };

    fetchLeaderboard();
  }, [leagueId]);

  return (
    <div>
      <h2>Leaderboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {teams.map((team) => (
            <li key={team.team_id}>
              {team.name ? (
                <>
                  <strong>Team:</strong> {team.name} <strong>Score:</strong> {team.score}
                </>
              ) : (
                <>
                  <strong>Email:</strong> {team.user_email} <strong>Score:</strong> {team.score}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <p id="message">{message}</p>
    </div>
  );
};

export default Leaderboard;
