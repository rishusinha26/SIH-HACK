import { useEffect, useState } from 'react'
import api from '../api/client.js'

export default function CareerPaths() {
  const [streams, setStreams] = useState([])
  const [careers, setCareers] = useState([])

  useEffect(() => {
    api.get('/recommend').then(({data}) => { setStreams(data.streams||[]); setCareers(data.careers||[]) })
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Recommended Careers</h1>
      <div className="mb-4">Streams: {streams.map(s => <span key={s} className="inline-block mr-2 px-2 py-1 bg-green-50 text-green-700 rounded">{s}</span>)}</div>
      <ul className="grid md:grid-cols-2 gap-4">
        {careers.map(c => (
          <li key={c._id} className="border rounded p-4">
            <h3 className="font-medium">{c.name}</h3>
            <p className="text-sm text-gray-600">Stream: {c.stream}</p>
            <p className="text-sm mt-2">{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}



