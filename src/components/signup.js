// signup.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import NavBarLogin from "./NavBarLogin"

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      alert('User signed up successfully!');
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <div>
      <NavBarLogin />
      <h2>Sign Up</h2>
      <div className='main_item'>
        <div className="login_signup_box">
          <div className="login_column_item">
            <input className = "login_column_internal" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="login_column_item">
            <input className = "login_column_internal" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="login_column_item">
            <button className = "login_column_internal login_signin_button" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
