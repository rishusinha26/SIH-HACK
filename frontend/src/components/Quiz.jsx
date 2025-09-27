import { useEffect, useState } from 'react'
import api from '../api/client.js'
import { useNavigate } from 'react-router-dom'

const initialScores = { logical: 0, verbal: 0, quantitative: 0, creative: 0, social: 0 }

export default function Quiz() {
  const navigate = useNavigate()
  const [scores, setScores] = useState(initialScores)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/quiz/mine').then(({data}) => setResult(data.result)).catch(()=>{})
  }, [])

  function onChange(key, val) {
    setScores(s => ({ ...s, [key]: Number(val) }))
  }

  async function submit() {
    setLoading(true)
    try {
      const { data } = await api.post('/quiz/submit', { scores })
      setResult(data.result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Aptitude Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(initialScores).map((k) => (
          <div key={k} className="space-y-1">
            <label className="block capitalize">{k} score: {scores[k]}</label>
            <input type="range" min="0" max="100" value={scores[k]} onChange={e=>onChange(k, e.target.value)} className="w-full"/>
          </div>
        ))}
      </div>
      <button onClick={submit} disabled={loading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Submitting...' : 'Submit Quiz'}</button>
      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-medium">Your Recommended Streams</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            {result.recommendedStreams.map((s)=> (
              <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{s}</span>
            ))}
          </div>
          <button onClick={()=>navigate('/careers')} className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded">View Careers</button>
        </div>
      )}
    </div>
  )
}


