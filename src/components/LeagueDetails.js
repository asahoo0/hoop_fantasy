import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const LeagueDetails = () => {
  const { leagueId } = useParams();
  const [userTeams, setUserTeams] = useState([]);
  const [draftStarted, setDraftStarted] = useState(false); // State to track if the draft has started
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const teamsCollectionRef = collection(db, 'teams');
        const userTeamsQuery = query(teamsCollectionRef, where('user_id', '==', userId));
        const teamsSnapshot = await getDocs(userTeamsQuery);
        const teams = teamsSnapshot.docs.map((doc) => doc.data());

        // Filter teams to only include those in the specified league
        const teamsInLeague = teams.filter((team) => team.league_id === leagueId);

        setUserTeams(teamsInLeague);
      } catch (error) {
        console.error('Error fetching user teams:', error.message);
      }
    };

    const fetchLeagueDetails = async () => {
      try {
        const leaguesCollectionRef = collection(db, 'leagues');
        const leagueDoc = doc(leaguesCollectionRef, leagueId);
        const leagueSnapshot = await getDoc(leagueDoc);
        
        if (leagueSnapshot.exists()) {
          const leagueData = leagueSnapshot.data();
          setDraftStarted(leagueData.draftStarted || false); // Assuming draftStarted is a boolean field
        }
      } catch (error) {
        console.error('Error fetching league details:', error.message);
      }
    };

    fetchUserTeams();
    fetchLeagueDetails();
  }, [leagueId, userId]);

  const handleStartDraft = async () => {
    try {
      const leaguesCollectionRef = collection(db, 'leagues');
      const leagueDocRef = doc(leaguesCollectionRef, leagueId);

      await updateDoc(leagueDocRef, { draftStarted: true, draftStartDate: serverTimestamp() });

      setDraftStarted(true);
    } catch (error) {
      console.error('Error starting draft:', error.message);
    }
  };

  return (
    <div>
      <h2>League Details</h2>
      {userTeams.length > 0 ? (
        <div>
          <p>You have a team in this league.</p>
          {draftStarted ? (
            <>
              {/* Display additional league details if needed */}
              <button onClick={() => navigate(`/add-to-team/${leagueId}`)}>Add to Team</button>
            </>
          ) : (
            <div>
              <p>Draft has not started. You cannot add to the team.</p>
              <button onClick={handleStartDraft}>Start Draft</button>
            </div>
          )}
          <button onClick={() => navigate(`/player-list/${leagueId}`)}>View Player List</button>
        </div>
      ) : (
        <div>
          <p>You don't have a team in this league.</p>
          {draftStarted ? (
            <>
              <button onClick={() => navigate(`/create-team/${leagueId}`)}>Create Team</button>
            </>
          ) : (
            <div>
              <p>Draft has not started. You cannot create a team.</p>
              <button onClick={handleStartDraft}>Start Draft</button>
            </div>
          )}
          <button onClick={() => navigate(`/player-list/${leagueId}`)}>View Player List</button>
        </div>
      )}
    </div>
  );
};

export default LeagueDetails;
