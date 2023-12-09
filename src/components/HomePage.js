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
                <p>
                    In the realm of sports, we wanted to create a unique space for basketball enthusiasts to immerse themselves in the thrill of fantasy leagues. By eliminating the complexities of traditional leagues and integrating creative customization, we hoped to redefine the fantasy sports experience.
                </p>
                <p>
                    We emphasize fun over monetary gain and that allows players to have a pressure-free environment in which they can actually enjoy the games they're playing instead of stressing over finance. We also emphasize creative freedom through our customizable player program.
                </p>
                <p>
                    Ultimately our aim is to ensure a fun, unique, and customizable fun experience for all of our users.
                </p>
                <p>
                    We hope you enjoy!
                </p>

            </div>
        </div>
    );
}

export default HomePage;