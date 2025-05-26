import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    const loc = useLocation();
    return token
        ? _jsx(_Fragment, { children: children })
        : _jsx(Navigate, { to: "/login", state: { from: loc }, replace: true });
}
