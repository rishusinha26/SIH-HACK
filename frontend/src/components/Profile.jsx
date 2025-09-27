import api from '../api/client.js'
import { useEffect, useState } from 'react'
import { useToast } from './ui/Toast.jsx'

export default function Profile() {
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', gradeLevel: '', location: { city: '', state: '' }, recoveryEmail: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/auth/me')
        setProfile(data.user)
        setForm({
          name: data.user?.name || '',
          gradeLevel: data.user?.gradeLevel || '',
          location: { city: data.user?.location?.city || '', state: data.user?.location?.state || '' },
          recoveryEmail: data.user?.recoveryEmail || '',
          phone: data.user?.phone || ''
        })
      } catch (error) {
        console.error('Failed to load profile:', error)
        addToast('Failed to load profile', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [addToast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-2">Profile</h1>
        {!editing && <button onClick={()=>setEditing(true)} className="px-3 py-1.5 rounded bg-blue-600 text-white">Edit</button>}
      </div>
      {!editing && (
        <>
          <div>Name: {profile.name}</div>
          <div>Email: {profile.email}</div>
          {profile.gradeLevel && <div>Grade: {profile.gradeLevel}</div>}
          {(profile.location?.city || profile.location?.state) && <div>Location: {profile.location?.city}{profile.location?.state ? `, ${profile.location?.state}`: ''}</div>}
          {profile.recoveryEmail && <div>Recovery Email: {profile.recoveryEmail}</div>}
          {profile.phone && <div>Phone: {profile.phone}</div>}
        </>
      )}
      {editing && (
        <form className="space-y-3" onSubmit={async (e)=>{
          e.preventDefault(); 
          setSaving(true)
          try {
            const { data } = await api.put('/auth/me', form)
            setProfile(data.user); 
            setEditing(false)
            addToast('Profile updated successfully!', 'success')
          } catch (err) {
            console.error('Failed to save profile:', err)
            addToast('Failed to update profile', 'error')
          } finally { 
            setSaving(false) 
          }
        }}>
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <input className="w-full border rounded p-2" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Grade</label>
            <input className="w-full border rounded p-2" value={form.gradeLevel} onChange={e=>setForm(f=>({...f, gradeLevel: e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-slate-600">City</label>
              <input className="w-full border rounded p-2" value={form.location.city} onChange={e=>setForm(f=>({...f, location: {...f.location, city: e.target.value}}))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">State</label>
              <input className="w-full border rounded p-2" value={form.location.state} onChange={e=>setForm(f=>({...f, location: {...f.location, state: e.target.value}}))} />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Recovery Email</label>
            <input className="w-full border rounded p-2" type="email" value={form.recoveryEmail} onChange={e=>setForm(f=>({...f, recoveryEmail: e.target.value}))} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input className="w-full border rounded p-2" type="tel" value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} />
          </div>
          <div className="flex gap-2">
            <button disabled={saving} className="px-3 py-1.5 rounded bg-blue-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="px-3 py-1.5 rounded bg-gray-100" onClick={()=>setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
      {Array.isArray(profile.recommendations?.streams) && profile.recommendations.streams.length > 0 && (
        <div className="mt-3">
          <div className="font-medium">Recommended Streams</div>
          <div className="flex gap-2 mt-1 flex-wrap">
            {profile.recommendations.streams.map((s) => (
              <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


