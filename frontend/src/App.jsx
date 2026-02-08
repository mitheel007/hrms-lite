import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import EmployeeForm from './components/EmployeeForm'
import EmployeeList from './components/EmployeeList'
import AttendancePanel from './components/AttendancePanel'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function App(){
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEmployees = async ()=>{
    setLoading(true)
    setError('')
    try{
      const res = await fetch(`${API_BASE}/employees`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setEmployees(data)
    }catch(err){
      setError('Failed to load employees. Please ensure the backend is running.')
      console.error(err)
    }finally{setLoading(false)}
  }

  useEffect(()=>{fetchEmployees()}, [])

  return (
    <div className="container">
      <header>
        <h1>👨‍💼 HRMS Lite</h1>
        <p style={{margin:0, fontSize:'13px', color:'var(--text-secondary)'}}>Human Resource Management System</p>
      </header>
      
      {error && <div className="error" style={{marginBottom:'20px'}}>{error}</div>}
      
      {/* Dashboard Section */}
      <section style={{marginBottom:'32px'}}>
        <Dashboard apiBase={API_BASE} employees={employees} />
      </section>
      
      <main>
        <section className="left">
          <EmployeeForm onAdded={fetchEmployees} apiBase={API_BASE} />
          <EmployeeList employees={employees} loading={loading} onDeleted={fetchEmployees} apiBase={API_BASE} />
        </section>
        <section className="right">
          <AttendancePanel employees={employees} apiBase={API_BASE} />
        </section>
      </main>
    </div>
  )
}
