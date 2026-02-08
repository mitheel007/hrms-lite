import React, {useState} from 'react'

export default function EmployeeForm({onAdded, apiBase}){
  const [form, setForm] = useState({employee_id:'', full_name:'', email:'', department:''})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!form.employee_id.trim()) newErrors.employee_id = 'Employee ID is required'
    if (!form.full_name.trim()) newErrors.full_name = 'Full Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required'
    if (!form.department.trim()) newErrors.department = 'Department is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async (e)=>{
    e.preventDefault()
    if (!validateForm()) return
    setError('')
    setSuccess('')
    setLoading(true)
    try{
      const res = await fetch(`${apiBase}/employees`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      if(!res.ok){
        const err = await res.json()
        setError(err.detail || 'Failed to add employee')
      } else {
        setForm({employee_id:'', full_name:'', email:'', department:''})
        setSuccess('Employee added successfully!')
        setTimeout(() => setSuccess(''), 3000)
        onAdded()
      }
    }catch(err){setError('Network error. Please try again.')}
    setLoading(false)
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>➕ Add Employee</h3>
      <label>Employee ID {errors.employee_id && <span style={{color:'var(--danger)'}}>*</span>}
        <input value={form.employee_id} onChange={e=>setForm({...form, employee_id:e.target.value})} disabled={loading} />
        {errors.employee_id && <div className="error">{errors.employee_id}</div>}
      </label>
      <label>Full Name {errors.full_name && <span style={{color:'var(--danger)'}}>*</span>}
        <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} disabled={loading} />
        {errors.full_name && <div className="error">{errors.full_name}</div>}
      </label>
      <label>Email {errors.email && <span style={{color:'var(--danger)'}}>*</span>}
        <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} disabled={loading} />
        {errors.email && <div className="error">{errors.email}</div>}
      </label>
      <label>Department {errors.department && <span style={{color:'var(--danger)'}}>*</span>}
        <input value={form.department} onChange={e=>setForm({...form, department:e.target.value})} disabled={loading} />
        {errors.department && <div className="error">{errors.department}</div>}
      </label>
      <div className="actions">
        <button type="submit" disabled={loading}>{loading? '⏳ Adding...':'➕ Add Employee'}</button>
      </div>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">✅ {success}</div>}
    </form>
  )
}
