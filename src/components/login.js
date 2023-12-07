// login.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import NavBarLogin from './NavBarLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      alert('User logged in successfully!');
      navigate("/");
    } catch (error) {
      alert('Error logging in: ' + error.message);
    }
  };

  return (
    <div>
      <NavBarLogin />
      <div className="main_item">
        <h2>Login</h2>
        <div className="login_signup_box">
          <div className="login_column_item">
            <input className = "login_column_internal" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="login_column_item">
            <input className = "login_column_internal" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="login_column_item">
            <button className = "login_column_internal login_signin_button" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
