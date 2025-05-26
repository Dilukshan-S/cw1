import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
export default function Login() {
    const [u, p] = [useState(''), useState('')];
    const nav = useNavigate();
    async function submit(e) {
        e.preventDefault();
        try {
            const { data } = await api.post('/login', { username: u[0], password: p[0] });
            localStorage.setItem('token', data.access_token);
            nav('/countries');
        }
        catch {
            alert('Login failed');
        }
    }
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Login" }), _jsxs("form", { onSubmit: submit, children: [_jsx("input", { value: u[0], onChange: e => u[1](e.target.value), placeholder: "Username" }), _jsx("input", { type: "password", value: p[0], onChange: e => p[1](e.target.value), placeholder: "Password" }), _jsx("button", { children: "Login" })] }), _jsx(Link, { to: "/register", children: "Register" })] }));
}
