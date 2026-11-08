import { Link, Navigate, useNavigate } from 'react-router-dom'
function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/login" />

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="card">
      <h2>Welcome to StyleSphere</h2>
      <p>Your wardrobe will appear here.</p>
      <p><Link to="/profile">Edit profile</Link></p>
      <p><Link to="/wardrobe/add">Add clothing item</Link></p>
      <p><Link to="/wardrobe">My wardrobe</Link></p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

export default Dashboard