import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../api';
export default function APIKeys() {
    const [keys, setKeys] = useState([]);
    const [newKey, setNewKey] = useState('');
    useEffect(() => {
        api.get('/apikeys').then(r => setKeys(r.data));
    }, []);
    const genKey = async () => {
        const { data } = await api.post('/apikeys');
        setNewKey(data.key);
        setKeys([data.key, ...keys]);
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "API Key Management" }), _jsx("button", { onClick: genKey, children: "Generate New Key" }), newKey && _jsxs("p", { children: ["Your new key: ", _jsx("code", { children: newKey })] }), _jsx("ul", { children: keys.map(k => _jsx("li", { children: _jsx("code", { children: k }) }, k)) })] }));
}
