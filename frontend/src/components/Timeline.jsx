import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from './ui/Toast.jsx'
import LoadingSpinner from './ui/LoadingSpinner'
import api from '../api/client.js'

export default function Timeline() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [items, setItems] = useState([])
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get('/timeline', { params: { type } })
      setItems(data.items || [])
    } catch (err) {
      console.error('Failed to load timeline:', err)
      setError('Failed to load timeline items')
      addToast('Failed to load timeline', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading timeline..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Timeline</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={load}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t('timeline.title', 'Admission & Scholarship Timeline')}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select 
            value={type} 
            onChange={e=>setType(e.target.value)} 
            className="form-input flex-1"
          >
            <option value="">{t('timeline.all', 'All')}</option>
            <option value="admission">{t('timeline.admissions', 'Admissions')}</option>
            <option value="scholarship">{t('timeline.scholarships', 'Scholarships')}</option>
            <option value="exam">{t('timeline.exams', 'Exams')}</option>
          </select>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('timeline.noItems', 'No timeline items found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('timeline.noItemsDesc', 'Try adjusting your filters or check back later.')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow card-hover">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{it.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{it.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {it.type}
                      </span>
                      {it.stream && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {it.stream}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right mt-2 sm:mt-0 sm:ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {it.deadline ? new Date(it.deadline).toLocaleDateString() : 'No deadline'}
                    </p>
                    {it.deadline && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(it.deadline).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
                {it.url && (
                  <div className="mt-3">
                    <a 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium" 
                      href={it.url} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      View Details →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



