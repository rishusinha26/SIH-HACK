import { useEffect, useState } from 'react'
import api from '../api/client.js'

export default function Colleges() {
  const [colleges, setColleges] = useState([])
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  async function load(initial=false) {
    setLoading(true)
    try {
      let effectiveCity = city
      if (initial && !city) {
        const me = await api.get('/auth/me').catch(()=>null)
        effectiveCity = me?.data?.user?.location?.city || ''
        if (effectiveCity) setCity(effectiveCity)
      }
      const { data } = await api.get('/colleges', { params: { q, city: effectiveCity } })
      setColleges(data.colleges || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load(true) }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Nearby Colleges</h1>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name" className="border p-2 rounded w-full" />
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" className="border p-2 rounded" />
        <button onClick={()=>load(false)} className="px-3 py-2 bg-blue-600 text-white rounded">{loading? 'Loading...' : 'Search'}</button>
      </div>
      <ul className="grid md:grid-cols-2 gap-4">
        {colleges.map(col => (
          <li key={col._id} className="border rounded p-4">
            <h3 className="font-medium">{col.name}</h3>
            <p className="text-sm text-gray-600">{col.city}, {col.state}</p>
            <div className="text-sm mt-2">Streams: {(col.streams||[]).join(', ')}</div>
            {col.website && <a className="text-blue-600 text-sm" href={col.website} target="_blank" rel="noreferrer">Website</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}


