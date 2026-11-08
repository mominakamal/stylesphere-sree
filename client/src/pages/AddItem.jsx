import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import api from '../api/api'

const CATEGORIES = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Footwear', 'Accessory']
const OCCASIONS = ['Casual', 'Formal', 'Party', 'Work', 'Traditional']
const MAX_SIZE = 5 * 1024 * 1024

function AddItem() {
  const token = localStorage.getItem('token')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [form, setForm] = useState({ name: '', category: '', colour: '', occasion: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!token) return <Navigate to="/login" />

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFile = (e) => {
    const picked = e.target.files[0]
    setError('')
    if (!picked) return
    if (!['image/jpeg', 'image/png'].includes(picked.type)) {
      setFile(null)
      setPreview('')
      return setError('Only JPG or PNG photos are allowed')
    }
    if (picked.size > MAX_SIZE) {
      setFile(null)
      setPreview('')
      return setError('Photo must be 5 MB or smaller')
    }
    setFile(picked)
    setPreview(URL.createObjectURL(picked))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!file) return setError('Please choose a photo')
    if (!form.name.trim()) return setError('Item name is required')
    if (!form.category) return setError('Choose a category')
    if (!form.colour.trim()) return setError('Colour is required')
    if (!form.occasion) return setError('Choose an occasion')

    const data = new FormData()
    data.append('photo', file)
    data.append('name', form.name)
    data.append('category', form.category)
    data.append('colour', form.colour)
    data.append('occasion', form.occasion)

    try {
      await api.post('/wardrobe', data)
      setSuccess('Item added to your wardrobe')
      setForm({ name: '', category: '', colour: '', occasion: '' })
      setFile(null)
      setPreview('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server')
    }
  }

  return (
    <div className="card">
      <h2>Add a clothing item</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />
        {preview && <img src={preview} alt="Preview" className="preview" />}
        <input name="name" placeholder="Item name (e.g. Blue kurta)" value={form.name} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="colour" placeholder="Colour (e.g. navy)" value={form.colour} onChange={handleChange} />
        <select name="occasion" value={form.occasion} onChange={handleChange}>
          <option value="">Select occasion</option>
          {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Add item</button>
      </form>
      <p><Link to="/dashboard">Back to dashboard</Link></p>
    </div>
  )
}

export default AddItem