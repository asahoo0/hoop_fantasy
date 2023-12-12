import React, { useState } from 'react';
import { auth } from '../firebase'; // Adjust the path accordingly
import NavBar from './NavBar';

const HomePage = (props) => {
    return (
        <div>
            <NavBar />
            <div className='main_item'>
                <h1>Hoop Fantasy</h1>
                <p>Welcome, {props.user.email}!</p>
                <div className='info'>
                    <div>
                    <p>
                        In the realm of sports, we wanted to create a unique space for basketball enthusiasts to immerse themselves in the thrill of fantasy leagues. By eliminating the complexities of traditional leagues and integrating creative customization, we hoped to redefine the fantasy sports experience.
                    </p>
                    <p>
                        We emphasize fun over monetary gain and that allows players to have a 
                        pressure-free environment in which they can actually enjoy the games
                        they're playing instead of stressing over finance. We also emphasize creative freedom through our customizable player program.
                    </p>
                    <p>
                        Ultimately our aim is to ensure a fun, unique, and customizable fun experience for all of our users.
                    </p>
                    <p>
                        We hope you enjoy!
                    </p>
                    </div>
                    <div className='howTo'>
                        <h2> How to Play</h2>
                        <p>
                            First, <b>Create a league</b>. When you create a league.
                            it will ask you for a league name. Upon making a 
                            league you will be given a join code. Share this join code with your friends
                            so they can join the league.

                        </p>
                        <p>
                            Once all your friends have joined, 
                             <b> Start the draft!</b> From here, each player will take turns
                            drafting a NBA player. Drafting will end once everyone has 7 players.
                            (Note: you will need to refresh your page to see when its your turn to draft again, so coordinate with the ppl you are playing with!)
                            
                        </p>
                        <p>
                            After drafting, <b>Score your teams!</b> Pick 5 of your players to use their full stats,
                            then pick which stats to use from your remaining players.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;