// YourLeagues.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Adjust the path accordingly
import { collection, query, where, getDocs } from 'firebase/firestore';

const YourLeagues = () => {
  const [userLeagues, setUserLeagues] = useState([]);

  useEffect(() => {
    const fetchUserLeagues = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Handle the case where the user is not authenticated
          return;
        }

        const userEmail = user.email;

        // Query the Firestore database to get leagues where the user is a participant
        const leaguesCollectionRef = collection(db, 'leagues');
        const q = query(leaguesCollectionRef, where('participants', 'array-contains', userEmail));
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

  return (
    <div>
      <h2>Your Leagues</h2>
      {userLeagues.length === 0 ? (
        <p>You are not in any leagues.</p>
      ) : (
        <ul>
          {userLeagues.map((league) => (
            <li key={league.id}>
              <strong>{league.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourLeagues;
