import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email')
    if (!form.password) return setError('Password is required')

    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server')
    }
  }

  return (
    <div className="card">
      <h2>Log in to StyleSphere</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </div>
  )
}

export default Login