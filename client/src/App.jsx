import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AddItem from './pages/AddItem'
import Wardrobe from './pages/Wardrobe'

function App() {
  return (
   <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/wardrobe/add" element={<AddItem />} />
  <Route path="/wardrobe" element={<Wardrobe />} />
</Routes>
  )
}

export default App