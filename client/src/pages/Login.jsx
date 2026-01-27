import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = ({ onLogin }) => {
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState('');

  const navigate = useNavigate();

  const readUsers = () => {
    try {
      const raw = localStorage.getItem('users');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  };

  const writeUsers = (users) => {
    try { localStorage.setItem('users', JSON.stringify(users)); } catch (e) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) { setMessage('Please enter an email'); return; }

    if (state === 'register') {
      // register: ensure email not taken
      const users = readUsers();
      const exists = users.find(u => String(u.email).toLowerCase() === normalizedEmail);
      if (exists) {
        setMessage('Email already registered. Please login.');
        return;
      }
      const newUser = { id: Date.now().toString(), name: name || '', email: normalizedEmail, password };
      users.push(newUser);
      writeUsers(users);
      // auto-login after signup
      try { localStorage.setItem('user', JSON.stringify({ name: newUser.name || '', email: newUser.email })); localStorage.setItem('token', 'demo-token'); } catch (e) {}
      if (typeof onLogin === 'function') onLogin({ name: newUser.name || '', email: newUser.email });
      navigate('/app');
      return;
    }

    // login flow: require existing user with matching password
    const users = readUsers();
    const found = users.find(u => String(u.email).toLowerCase() === normalizedEmail);
    if (!found) {
      setMessage('No account found for this email. Please sign up first.');
      return;
    }
    // simple password check (demo)
    if ((found.password || '') !== password) {
      setMessage('Invalid password.');
      return;
    }

    // success
    try { localStorage.setItem('user', JSON.stringify({ name: found.name || '', email: found.email })); localStorage.setItem('token', 'demo-token'); } catch (e) {}
    if (typeof onLogin === 'function') onLogin({ name: found.name || '', email: found.email });
    navigate('/app');
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-card">
        <p className="login-title">
          <span className="login-title-accent">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>
      {state === "register" && (
        <div className="w-full">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="input" type="text" required />
        </div>
      )}
      {message && <div className="form-message" role="alert">{message}</div>}
        <div className="input-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="input" type="email" required />
        </div>
        <div className="input-row">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="input" type="password" required />
        </div>
      {state === "register" ? (
        <p>
          Already have account? <span onClick={() => { setMessage(''); setState("login") }} className="link-like">click here</span>
        </p>
      ) : (
        <p>
          Create an account? <span onClick={() => { setMessage(''); setState("register") }} className="link-like">click here</span>
        </p>
      )}
      <button type="submit" className="primary-btn">
        {state === "register" ? "Create Account" : "Login"}
      </button>
      </form>
    </div>
  );
};

export default Login
