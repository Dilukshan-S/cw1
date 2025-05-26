import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from 'react-router-dom';
export default function Header() {
    const nav = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        nav('/login');
    };
    return (_jsxs("header", { className: "p-4 bg-gray-100 flex justify-between", children: [_jsxs("nav", { children: [_jsx(Link, { className: "mr-4", to: "/countries", children: "Countries" }), _jsx(Link, { className: "mr-4", to: "/apikeys", children: "API Keys" })] }), _jsx("button", { onClick: logout, children: "Logout" })] }));
}
