import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust the path accordingly
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const YourLeagues = () => {
  const [userLeagues, setUserLeagues] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchUserLeagues = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Handle the case where the user is not authenticated
          return;
        }

        const userUID = user.uid;

        // Query the Firestore database to get leagues where the user is a participant
        const leaguesCollectionRef = collection(db, 'leagues');
        const q = query(leaguesCollectionRef, where('participants', 'array-contains', userUID));
        const querySnapshot = await getDocs(q);

        const leagues = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserLeagues(leagues);
      } catch (error) {
        console.error('Error fetching user leagues:', error.message);
      }
    };

    fetchUserLeagues();
  }, []);

  // Handle league click event
  const handleLeagueClick = (leagueId) => {
    // Use navigate to navigate to PlayerList.js with the leagueId as a route parameter
    navigate(`/league-details/${leagueId}`);
  };

  return (
    <div>
      <h2>Your Leagues</h2>
      {userLeagues.length === 0 ? (
        <p>You are not in any leagues.</p>
      ) : (
        <ul>
          {userLeagues.map((league) => (
            <li key={league.id} onClick={() => handleLeagueClick(league.id)} style={{ cursor: 'pointer' }}>
              <Link to={`/league-details/${league.id}`}>
                <strong>{league.name}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourLeagues;
