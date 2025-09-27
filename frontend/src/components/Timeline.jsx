import { useEffect, useState } from 'react'
import api from '../api/client.js'

export default function Timeline() {
  const [items, setItems] = useState([])
  const [type, setType] = useState('')

  async function load() {
    const { data } = await api.get('/timeline', { params: { type } })
    setItems(data.items || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Admission & Scholarship Timeline</h1>
      <div className="flex gap-2 mb-4">
        <select value={type} onChange={e=>setType(e.target.value)} className="border p-2 rounded">
          <option value="">All</option>
          <option value="admission">Admissions</option>
          <option value="scholarship">Scholarships</option>
          <option value="exam">Exams</option>
        </select>
        <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded">Filter</button>
      </div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it._id} className="border rounded p-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{it.title}</h3>
              {it.deadline && <span className="text-sm text-gray-600">{new Date(it.deadline).toLocaleDateString()}</span>}
            </div>
            <div className="text-sm text-gray-600">{it.type}</div>
            {it.url && <a className="text-blue-600 text-sm" href={it.url} target="_blank" rel="noreferrer">Details</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}



