// signup.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import NavBarLogin from "./NavBarLogin"

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      document.getElementById('message').style.color = 'lightgreen'
      setMessage('User signed up successfully!')
    } catch (error) {
      document.getElementById('message').style.color = 'red'
      setMessage('Error signing up: ' + error.message)
    }
  };

  return (
    <div>
      <NavBarLogin />
      <div className='main_item'>
        <h2>Sign Up</h2>
        <div>
          <div className="login_signup_box">
            <div className="login_column_item">
              <input className = "login_column_internal" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="login_column_item">
              <input className = "login_column_internal" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="login_column_item">
              <button disabled={!email || !password} className = "login_column_internal login_signin_button" onClick={handleSignUp}>Sign Up</button>
            </div>
            <div className="login_column_item">
              <p id="message">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
