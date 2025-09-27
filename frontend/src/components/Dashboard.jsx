import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    quizCompleted: false,
    recommendedStreams: [],
    nearbyColleges: 0,
    upcomingDeadlines: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [quizResult, recommendations, colleges, timeline] = await Promise.all([
          api.get('/quiz/mine').catch(() => ({ data: { result: null } })),
          api.get('/recommend').catch(() => ({ data: { streams: [], careers: [], colleges: [] } })),
          api.get('/colleges').catch(() => ({ data: { colleges: [] } })),
          api.get('/timeline').catch(() => ({ data: { items: [] } }))
        ])

        setStats({
          quizCompleted: !!quizResult.data.result,
          recommendedStreams: recommendations.data.streams || [],
          nearbyColleges: colleges.data.colleges?.length || 0,
          upcomingDeadlines: timeline.data.items?.length || 0
        })
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.name || 'Student'}</span>! 🎓
          </h1>
          <p className="text-xl text-blue-200 mb-8">Your personalized education journey starts here</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="dashboard-card p-6 rounded-2xl text-center group">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Quiz Status</h3>
            <p className={`text-2xl font-bold ${stats.quizCompleted ? 'text-green-400' : 'text-orange-400'}`}>
              {stats.quizCompleted ? 'Completed' : 'Pending'}
            </p>
            {!stats.quizCompleted && (
              <Link to="/quiz" className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105">
                Take Quiz
              </Link>
            )}
          </div>

          <div className="dashboard-card p-6 rounded-2xl text-center group">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Recommended Streams</h3>
            <p className="text-2xl font-bold text-purple-400">{stats.recommendedStreams.length}</p>
            {stats.recommendedStreams.length > 0 && (
              <Link to="/careers" className="inline-block mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105">
                View Streams
              </Link>
            )}
          </div>

          <div className="dashboard-card p-6 rounded-2xl text-center group">
            <div className="text-4xl mb-3">🏫</div>
            <h3 className="text-xl font-semibold text-white mb-2">Nearby Colleges</h3>
            <p className="text-2xl font-bold text-green-400">{stats.nearbyColleges}</p>
            <Link to="/colleges" className="inline-block mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover:scale-105">
              Explore
            </Link>
          </div>

          <div className="dashboard-card p-6 rounded-2xl text-center group">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Upcoming Deadlines</h3>
            <p className="text-2xl font-bold text-orange-400">{stats.upcomingDeadlines}</p>
            <Link to="/timeline" className="inline-block mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-300 hover:scale-105">
              View Timeline
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="dashboard-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              🚀 Quick Actions
            </h2>
            <div className="space-y-4">
              <Link to="/quiz" className="flex items-center p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-2xl mr-4">🧠</div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300">Take Aptitude Quiz</h3>
                  <p className="text-blue-200">Discover your strengths and interests</p>
                </div>
              </Link>
              
              <Link to="/careers" className="flex items-center p-4 bg-green-600/20 hover:bg-green-600/30 rounded-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-2xl mr-4">💼</div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-300">Explore Careers</h3>
                  <p className="text-green-200">Find your perfect career path</p>
                </div>
              </Link>
              
              <Link to="/colleges" className="flex items-center p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-2xl mr-4">🏫</div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300">Find Colleges</h3>
                  <p className="text-purple-200">Discover nearby educational institutions</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="dashboard-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              📊 Your Progress
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-white mb-2">
                  <span>Profile Completion</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full shimmer"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-white mb-2">
                  <span>Quiz Completion</span>
                  <span>{stats.quizCompleted ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${stats.quizCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500 shimmer' : 'bg-gray-600'}`} style={{width: stats.quizCompleted ? '100%' : '0%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-white mb-2">
                  <span>Career Exploration</span>
                  <span>{stats.recommendedStreams.length > 0 ? '50%' : '0%'}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-1000 ${stats.recommendedStreams.length > 0 ? 'bg-gradient-to-r from-orange-500 to-red-500 shimmer' : 'bg-gray-600'}`} style={{width: stats.recommendedStreams.length > 0 ? '50%' : '0%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Streams Preview */}
        {stats.recommendedStreams.length > 0 && (
          <div className="mt-12 dashboard-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              🎯 Your Recommended Streams
            </h2>
            <div className="flex flex-wrap gap-3">
              {stats.recommendedStreams.map((stream, index) => (
                <span 
                  key={stream} 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {stream}
                </span>
              ))}
            </div>
            <Link to="/careers" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
              Explore Career Paths →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
