import { useState } from 'react'
import api from '../api/api'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) return setError('Name is required')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email')
    if (form.password.length < 8 || !/\d/.test(form.password))
      return setError('Password must be at least 8 characters and include a number')
    if (form.password !== form.confirm) return setError('Passwords do not match')

    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setSuccess('Account created. You can log in now.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server')
    }
  }

  return (
    <div className="card">
      <h2>Create your StyleSphere account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input name="confirm" type="password" placeholder="Confirm password" value={form.confirm} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register