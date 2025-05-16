import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Countries from './pages/Countries';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/countries" element={
          localStorage.getItem('token') ? <Countries/> : <Navigate to="/login"/>
        }/>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;