import React, { useEffect, useState } from 'react'
import { getDashboard, getUsers, getRevenue, getAIUsage } from './api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

const COLORS = ['#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6']

export default function Dashboard({ onLogout }) {
  const [data, setData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getUsers(), getRevenue(), getAIUsage()])
      .then(([d, u, r, a]) => { setData(d.data); setUsers(u.data); setRevenue(r.data); setAI(a.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const [revenue, setRevenue] = useState({ monthly: [], yearly: [], total_revenue: 0 })
  const [ai, setAI] = useState({ daily: [], total_tokens: 0 })

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p style={{ fontSize: 20, color: '#999' }}>加载中...</p></div>

  const stats = data?.stats || {}

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ background: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ margin: 0, fontSize: 22, color: '#333' }}>📊 沟通健身房 · 数据看板</h1>
        <button onClick={onLogout} style={{ padding: '8px 20px', background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>退出</button>
      </header>

      <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard title="总用户数" value={stats.user_count} color="#4A90E2" />
          <StatCard title="活跃用户" value={stats.active_users} color="#50C878" />
          <StatCard title="试用用户" value={stats.trial_users} color="#FFB347" />
          <StatCard title="付费用户" value={stats.paid_users} color="#9B59B6" />
        </div>

        {/* Section A: User Overview */}
        <Section title="👥 用户概览">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card>
              <h3 style={chartTitle}>练习活跃度</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={[{ name: '总用户', value: stats.user_count }, { name: '活跃用户', value: stats.active_users }, { name: '付费用户', value: stats.paid_users }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4A90E2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <h3 style={chartTitle}>会员分布</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={[
                    { name: '试用中', value: stats.trial_users || 0 },
                    { name: '已付费', value: stats.paid_users || 0 },
                    { name: '未激活', value: Math.max(0, (stats.user_count || 0) - (stats.trial_users || 0) - (stats.paid_users || 0)) }
                  ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </Section>

        {/* Section B: Revenue */}
        <Section title="💰 收入概览">
          <Card>
            <h3 style={chartTitle}>月度收入趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenue.monthly.length > 0 ? revenue.monthly : [{ month: '7月', amount: 0 }, { month: '8月', amount: 0 }, { month: '9月', amount: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4A90E2" strokeWidth={2} name="收入 (¥)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Section>

        {/* Section C: AI Usage */}
        <Section title="🤖 AI 使用量">
          <Card>
            <h3 style={chartTitle}>每日 API 调用量</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ai.daily.length > 0 ? ai.daily : Array.from({ length: 7 }, (_, i) => ({ date: `Day ${i + 1}`, calls: 0 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#50C878" radius={[4, 4, 0, 0]} name="调用次数" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Section>

        {/* Section D: Recent Users */}
        <Section title="📋 最近用户">
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={th}>昵称</th><th style={th}>邮箱</th><th style={th}>注册时间</th><th style={th}>状态</th>
                </tr>
              </thead>
              <tbody>
                {(users.users || []).slice(0, 10).map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={td}>{u.nickname}</td>
                    <td style={td}>{u.email}</td>
                    <td style={td}>{u.created_at}</td>
                    <td style={td}><span style={{ padding: '2px 8px', borderRadius: 10, background: u.is_active ? '#e8f5e9' : '#ffebee', color: u.is_active ? '#4caf50' : '#f44336', fontSize: 12 }}>{u.is_active ? '活跃' : '停用'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Section>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${color}` }}>
    <p style={{ margin: 0, color: '#999', fontSize: 13 }}>{title}</p>
    <p style={{ margin: '8px 0 0', fontSize: 32, fontWeight: 700, color }}>{value ?? '-'}</p>
  </div>
}

function Section({ title, children }) {
  return <div style={{ marginBottom: 24 }}>
    <h2 style={{ fontSize: 18, color: '#333', marginBottom: 16 }}>{title}</h2>
    {children}
  </div>
}

function Card({ children }) {
  return <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{children}</div>
}

const chartTitle = { fontSize: 15, color: '#666', marginBottom: 16, fontWeight: 500 }
const th = { padding: '12px 16px', fontSize: 13, color: '#999', fontWeight: 600 }
const td = { padding: '12px 16px', fontSize: 14, color: '#333' }
