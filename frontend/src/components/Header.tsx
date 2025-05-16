import { useNavigate, Link } from 'react-router-dom'

export default function Header() {
  const nav = useNavigate()
  const logout = () => {
    localStorage.removeItem('token')
    nav('/login')
  }

  return (
    <header className="p-4 bg-gray-100 flex justify-between">
      <nav>
        <Link className="mr-4" to="/countries">Countries</Link>
        <Link className="mr-4" to="/apikeys">API Keys</Link>
      </nav>
      <button onClick={logout}>Logout</button>
    </header>
  )
}