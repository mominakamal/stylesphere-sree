import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../api/api'

const CATEGORIES = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Footwear', 'Accessory']
const OCCASIONS = ['Casual', 'Formal', 'Party', 'Work', 'Traditional']

function Wardrobe() {
  const token = localStorage.getItem('token')
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ category: '', occasion: '', colour: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    api.get('/wardrobe')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load your wardrobe'))
      .finally(() => setLoading(false))
  }, [token])

  if (!token) return <Navigate to="/login" />

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const shown = items.filter((item) =>
    (!filters.category || item.category === filters.category) &&
    (!filters.occasion || item.occasion === filters.occasion) &&
    (!filters.colour.trim() || item.colour.toLowerCase().includes(filters.colour.trim().toLowerCase()))
  )

  return (
    <div className="wide">
      <h2>My wardrobe</h2>
      <div className="filters">
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="occasion" value={filters.occasion} onChange={handleChange}>
          <option value="">All occasions</option>
          {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <input name="colour" placeholder="Colour" value={filters.colour} onChange={handleChange} />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>Your wardrobe is empty. Add your first item.</p>}
      {!loading && !error && items.length > 0 && shown.length === 0 && <p>No items found for these filters.</p>}

      <div className="grid">
        {shown.map((item) => (
          <div className="item" key={item._id}>
            <img src={`http://localhost:5000${item.photo}`} alt={item.name} />
            <h4>{item.name}</h4>
            <p>{item.category} | {item.colour} | {item.occasion}</p>
          </div>
        ))}
      </div>

      <p>
        <Link to="/wardrobe/add">Add item</Link> | <Link to="/dashboard">Back to dashboard</Link>
      </p>
    </div>
  )
}

export default Wardrobe