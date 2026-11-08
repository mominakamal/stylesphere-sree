import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../api/api'

const STYLE_OPTIONS = ['Casual', 'Formal', 'Traditional', 'Sporty', 'Party']

function Profile() {
  const token = localStorage.getItem('token')
  const [form, setForm] = useState({ name: '', city: '', styles: [], colours: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) return
    api.get('/profile')
      .then((res) => setForm({
        name: res.data.name || '',
        city: res.data.city || '',
        styles: res.data.styles || [],
        colours: res.data.colours || '',
      }))
      .catch(() => setError('Could not load your profile'))
  }, [token])

  if (!token) return <Navigate to="/login" />

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleStyle = (style) => {
    const styles = form.styles.includes(style)
      ? form.styles.filter((s) => s !== style)
      : [...form.styles, style]
    setForm({ ...form, styles })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) return setError('Name is required')
    if (!form.city.trim()) return setError('City is required')
    if (form.styles.length === 0) return setError('Pick at least one style')

    try {
      await api.put('/profile', form)
      setSuccess('Profile saved')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server')
    }
  }

  return (
    <div className="card">
      <h2>Your profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="city" placeholder="City (used for weather)" value={form.city} onChange={handleChange} />
        <p className="label">Style preferences</p>
        <div className="checks">
          {STYLE_OPTIONS.map((s) => (
            <label key={s}>
              <input type="checkbox" checked={form.styles.includes(s)} onChange={() => toggleStyle(s)} />
              {s}
            </label>
          ))}
        </div>
        <input name="colours" placeholder="Favourite colours (e.g. black, navy)" value={form.colours} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Save profile</button>
      </form>
      <p><Link to="/dashboard">Back to dashboard</Link></p>
    </div>
  )
}

export default Profile