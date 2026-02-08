import React, {useState} from 'react'

export default function EmployeeList({employees, loading, onDeleted, apiBase}){
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const remove = async (emp)=>{
    if(!confirm(`Are you sure you want to delete ${emp.full_name}?`)) return
    setDeleting(emp.id)
    setError('')
    try{
      const res = await fetch(`${apiBase}/employees/${emp.employee_id}`,{method:'DELETE'})
      if(res.status===204) onDeleted()
      else {
        const j = await res.json()
        setError(j.detail || 'Failed to delete')
      }
    }catch(err){setError('Network error')}
    setDeleting(null)
  }

  if(loading) return (
    <div className="card">
      <div className="loading"><div className="spinner"></div> Loading employees...</div>
    </div>
  )
  
  if(!employees || employees.length===0) return (
    <div className="card">
      <div className="empty-state">
        <div style={{fontSize:'32px'}}>👥</div>
        <p>No employees found</p>
        <p style={{fontSize:'12px',marginTop:'4px'}}>Add your first employee to get started</p>
      </div>
    </div>
  )

  return (
    <div className="card">
      <h3>📋 Employee List ({employees.length})</h3>
      {error && <div className="error">{error}</div>}
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Dept</th><th>Actions</th></tr></thead>
        <tbody>
          {employees.map(e=> (
            <tr key={e.id}>
              <td><strong>{e.employee_id}</strong></td>
              <td>{e.full_name}</td>
              <td>{e.email}</td>
              <td>{e.department}</td>
              <td>
                <button className="link" onClick={()=>remove(e)} disabled={deleting===e.id}>
                  {deleting===e.id ? '⏳' : '❌'} {deleting===e.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
