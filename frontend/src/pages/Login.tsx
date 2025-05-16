import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login(){
  const [u,p] = [useState(''),useState('')];
  const nav = useNavigate();
  async function submit(e:any){
    e.preventDefault();
    try {
      const { data } = await api.post('/login', { username:u[0], password:p[0] });
      localStorage.setItem('token', data.access_token);
      nav('/countries');
    } catch {
      alert('Login failed');
    }
  }
  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={u[0]} onChange={e=>u[1](e.target.value)} placeholder="Username"/>
        <input type="password" value={p[0]} onChange={e=>p[1](e.target.value)} placeholder="Password"/>
        <button>Login</button>
      </form>
      <Link to="/register">Register</Link>
    </div>
  );
}
