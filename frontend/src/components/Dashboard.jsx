import React, { useEffect, useState } from 'react'

export default function Dashboard({ apiBase, employees }) {
  const [stats, setStats] = useState(null)
  const [employeeStats, setEmployeeStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (selectedEmployee && employees.length > 0) {
      const emp = employees.find(e => e.employee_id === selectedEmployee)
      if (emp) {
        fetchEmployeeStats(selectedEmployee)
      }
    }
  }, [selectedEmployee])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/stats`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchEmployeeStats = async (empId) => {
    try {
      const res = await fetch(`${apiBase}/employees/${empId}/stats`)
      if (res.ok) {
        const data = await res.json()
        setEmployeeStats(prev => ({ ...prev, [empId]: data }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="card"><div className="loading"><div className="spinner"></div> Loading dashboard...</div></div>
  }

  return (
    <div>
      {/* System Stats */}
      <div className="card">
        <h3>📊 Dashboard Summary</h3>
        {stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: '#eff6ff',
              borderRadius: '8px',
              borderLeft: '4px solid #2563eb'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Total Employees</div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#2563eb' }}>{stats.total_employees}</div>
            </div>
            <div style={{
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '8px',
              borderLeft: '4px solid #16a34a'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Present Today</div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#16a34a' }}>{stats.present_today}</div>
            </div>
            <div style={{
              padding: '16px',
              background: '#fee2e2',
              borderRadius: '8px',
              borderLeft: '4px solid #dc2626'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Absent Today</div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#dc2626' }}>{stats.absent_today}</div>
            </div>
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '8px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Total Records</div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#f59e0b' }}>{stats.total_attendance_records}</div>
            </div>
          </div>
        ) : (
          <div className="empty-state"><p>No data available</p></div>
        )}
      </div>

      {/* Employee Stats */}
      {employees && employees.length > 0 && (
        <div className="card">
          <h3>👤 Employee Performance</h3>
          <label>Select Employee
            <select 
              value={selectedEmployee || ''} 
              onChange={e => setSelectedEmployee(e.target.value)}
            >
              <option value="">-- Choose an employee --</option>
              {employees.map(e => (
                <option key={e.employee_id} value={e.employee_id}>
                  {e.full_name} ({e.employee_id})
                </option>
              ))}
            </select>
          </label>

          {selectedEmployee && employeeStats[selectedEmployee] && (
            <div style={{ marginTop: '16px' }}>
              {(() => {
                const stats = employeeStats[selectedEmployee]
                const percentage = stats.attendance_percentage
                const statusColor = percentage >= 80 ? '#16a34a' : percentage >= 60 ? '#f59e0b' : '#dc2626'
                
                return (
                  <div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        padding: '12px',
                        background: '#f0fdf4',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Present Days</div>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#16a34a' }}>
                          {stats.total_present_days}
                        </div>
                      </div>
                      <div style={{
                        padding: '12px',
                        background: '#fee2e2',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Absent Days</div>
                        <div style={{ fontSize: '24px', fontWeight: '600', color: '#dc2626' }}>
                          {stats.total_absent_days}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Attendance Rate</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', color: statusColor }}>
                        {percentage}%
                      </div>
                      <div style={{
                        marginTop: '12px',
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: statusColor,
                          transition: 'width 0.3s'
                        }}></div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
