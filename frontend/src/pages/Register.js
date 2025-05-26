import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        try {
            await api.post('/register', { username, password });
            nav('/login');
        }
        catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Register" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { placeholder: "Username", value: username, onChange: e => setUsername(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: e => setPassword(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Confirm Password", value: confirm, onChange: e => setConfirm(e.target.value), required: true }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsx("button", { type: "submit", children: "Register" })] }), _jsx(Link, { to: "/login", children: "Back to Login" })] }));
}
