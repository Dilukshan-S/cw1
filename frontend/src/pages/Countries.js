import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../api';
export default function Countries() {
    const [data, setData] = useState([]);
    useEffect(() => {
        api.get('/countries').then(r => setData(r.data));
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Countries" }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsx("tr", { children: ['Country', 'Capital', 'Currency', 'Languages', 'Flag'].map(h => _jsx("th", { children: h }, h)) }) }), _jsx("tbody", { children: data.map(c => (_jsxs("tr", { children: [_jsx("td", { children: c.name }), _jsx("td", { children: c.capital }), _jsx("td", { children: c.currency }), _jsx("td", { children: c.languages.join(', ') }), _jsx("td", { children: _jsx("img", { src: c.flag, width: 40 }) })] }, c.name))) })] })] }));
}
