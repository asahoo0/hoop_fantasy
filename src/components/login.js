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
  const [default_username, set_default_username] = useState(false);
  const [default_password, set_default_password] = useState(false);

  const manage_email = (e) => {
    setEmail(e.target.value);
    //alert(e.target.value);
    if(!(e.target.value === "")) {
      set_default_username(true);
    } else {
      set_default_password(false);
    }
    //alert(default_username);
  }

  const manage_password = (e) => {
    setPassword(e.target.value);
    if(!(e.target.value === ""))
      set_default_password(true);
    else
      set_default_password(false);
  }
  return (
    <div>
      <NavBarLogin />
      <div className="main_item">
        <h2>Login</h2>
        <div className="login_signup_box">
          <div className="login_column_item">
            <input className = "login_column_internal" placeholder="Email" type="email" onChange={manage_email} />
          </div>
          <div className="login_column_item">
            <input className = "login_column_internal" type="password" placeholder="Password" onChange={manage_password} />
          </div>
          <div className="login_column_item">
            <button disabled = {!default_password && !default_username}className = "login_column_internal login_signin_button" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
