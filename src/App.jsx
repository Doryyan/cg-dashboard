import React, { useState } from 'react'
import { login } from './api'
import Dashboard from './Dashboard'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'))

  if (!token) return <LoginPage onLogin={t => { localStorage.setItem('admin_token', t); setToken(t) }} />
  return <Dashboard onLogout={() => { localStorage.removeItem('admin_token'); setToken(null) }} />
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@huichengjia.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await login(email, password)
      onLogin(res.data.access_token)
    } catch { setError('登录失败，请检查管理员账号密码') }
    finally { setLoading(false) }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📊 沟通健身房</h1>
        <p style={styles.subtitle}>数据运营看板</p>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="管理员邮箱" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>{loading ? '登录中...' : '登录'}</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  card: { background: '#fff', borderRadius: 16, padding: 48, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  title: { fontSize: 28, textAlign: 'center', margin: 0, color: '#333' },
  subtitle: { textAlign: 'center', color: '#999', marginTop: 8, marginBottom: 32 },
  input: { width: '100%', padding: '12px 16px', marginBottom: 16, border: '1px solid #ddd', borderRadius: 8, fontSize: 16, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '14px', background: '#4A90E2', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  error: { color: '#e74c3c', textAlign: 'center', marginBottom: 16, fontSize: 14 }
}
