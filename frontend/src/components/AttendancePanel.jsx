import React, {useState, useEffect} from 'react'

export default function AttendancePanel({employees, apiBase}){
  const [selected, setSelected] = useState(null)
  const [records, setRecords] = useState([])
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('Present')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [markingLoading, setMarkingLoading] = useState(false)

  useEffect(()=>{ if(employees && employees.length && !selected) setSelected(employees[0].employee_id) }, [employees])

  const fetchRecords = async ()=>{
    if(!selected) return
    setLoading(true)
    setError('')
    try{
      const res = await fetch(`${apiBase}/employees/${selected}/attendance`)
      if(!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRecords(data)
    }catch(err){setError('Failed to load attendance records')}
    setLoading(false)
  }

  useEffect(()=>{ fetchRecords() }, [selected])

  const submit = async (e)=>{
    e.preventDefault()
    if(!selected || !date) {
      setError('Please select employee and date')
      return
    }
    setError('')
    setSuccess('')
    setMarkingLoading(true)
    try{
      const res = await fetch(`${apiBase}/employees/${selected}/attendance`,{
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({date, status})
      })
      if(!res.ok){ 
        const j=await res.json()
        setError(j.detail || 'Failed to mark attendance')
      }
      else { 
        setDate('')
        setSuccess('✅ Attendance marked successfully!')
        setTimeout(() => setSuccess(''), 3000)
        fetchRecords() 
      }
    }catch(err){setError('Network error')}
    setMarkingLoading(false)
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="card">
        <h3>🗓️ Attendance</h3>
        <div className="empty-state">
          <p>No employees to mark attendance</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>🗓️ Attendance Management</h3>
      
      <label>Select Employee
        <select value={selected||''} onChange={e=>setSelected(e.target.value)}>
          {employees.map(e=> <option key={e.employee_id} value={e.employee_id}>{e.full_name} ({e.employee_id})</option>)}
        </select>
      </label>

      <form onSubmit={submit} className="attendance-form">
        <div>
          <label>Date
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} disabled={markingLoading} />
          </label>
          <label>Status
            <select value={status} onChange={e=>setStatus(e.target.value)} disabled={markingLoading}>
              <option>Present</option>
              <option>Absent</option>
            </select>
          </label>
        </div>
        <button type="submit" disabled={markingLoading || !date}>{markingLoading ? '⏳' : '✓'}</button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="records">
        <h4>Records</h4>
        {loading ? (
          <div className="loading"><div className="spinner"></div> Loading...</div>
        ) : records.length ? (
          <table className="table">
            <thead><tr><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {records.map(r=> (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      padding:'4px 8px',
                      borderRadius:'4px',
                      backgroundColor: r.status==='Present'?'#dcfce7':'#fee2e2',
                      color: r.status==='Present'?'#16a34a':'#dc2626'
                    }}>
                      {r.status === 'Present' ? '✅' : '❌'} {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state" style={{padding:'20px'}}>
            <p style={{fontSize:'14px'}}>No attendance records</p>
          </div>
        )}
      </div>
    </div>
  )
}
