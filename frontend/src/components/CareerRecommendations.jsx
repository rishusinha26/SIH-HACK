import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from './ui/Toast.jsx'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import SearchBar from './ui/SearchBar'
import FilterDropdown from './ui/FilterDropdown'
import LoadingSpinner from './ui/LoadingSpinner'
import api from '../api/client'
import { aptitudeProfiles, careerFields } from '../data/careerData'
import { states, formatCurrency } from '../data/collegeData'

export default function CareerRecommendations() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedField, setSelectedField] = useState(null)
  const [recommendedColleges, setRecommendedColleges] = useState([])
  const [collegeFilters, setCollegeFilters] = useState({
    maxFee: '',
    state: '',
    hostel: false
  })
  const [showColleges, setShowColleges] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadQuizResult()
  }, [])

  const loadQuizResult = async () => {
    try {
      const { data } = await api.get('/quiz/mine')
      setQuizResult(data.result)
      if (data.result?.recommendedStreams?.length > 0) {
        const firstStream = data.result.recommendedStreams[0]
        setSelectedField(careerFields[firstStream] || careerFields.Engineering)
        // Load recommended colleges
        loadRecommendedColleges(data.result.recommendedStreams)
      }
    } catch (error) {
      console.error('Failed to load quiz result:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendedColleges = async (streams) => {
    try {
      const { data } = await api.get('/colleges', {
        params: { streams: streams.join(',') }
      })
      setRecommendedColleges(data.colleges || [])
    } catch (error) {
      console.error('Failed to load recommended colleges:', error)
    }
  }

  const filterColleges = () => {
    let filtered = recommendedColleges

    if (collegeFilters.maxFee) {
      filtered = filtered.filter(college => 
        college.fees?.annual <= parseInt(collegeFilters.maxFee)
      )
    }

    if (collegeFilters.state) {
      filtered = filtered.filter(college => 
        college.state === collegeFilters.state
      )
    }

    if (collegeFilters.hostel) {
      filtered = filtered.filter(college => 
        college.hostel?.available === true
      )
    }

    return filtered
  }

  const getAptitudeProfile = () => {
    if (!quizResult?.scores) return aptitudeProfiles.logical
    
    const scores = quizResult.scores
    const topScore = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b)
    return aptitudeProfiles[topScore] || aptitudeProfiles.logical
  }

  const getFieldColor = (field) => {
    const colors = {
      Engineering: 'blue',
      Medicine: 'red',
      Arts: 'purple',
      Commerce: 'green',
      Science: 'indigo'
    }
    return colors[field] || 'blue'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    )
  }

  if (!quizResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Quiz Results Found</h2>
          <p className="text-gray-600 mb-6">Please complete the aptitude quiz first to see your career recommendations.</p>
          <Button onClick={() => navigate('/quiz')}>
            Take Quiz
          </Button>
        </Card>
      </div>
    )
  }

  const profile = getAptitudeProfile()
  const recommendedStreams = quizResult.recommendedStreams || ['Engineering']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <span className="text-4xl">{profile.icon}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations! You're <span className={`text-${profile.color}-600`}>{profile.title}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {profile.description} Based on your quiz results, here are the career paths that best match your strengths.
          </p>
        </div>

        {/* Primary Recommended Field */}
        {selectedField && (
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 bg-${getFieldColor(selectedField.title.split(' ')[0])}-100 rounded-xl flex items-center justify-center`}>
                  <span className="text-3xl">{selectedField.icon}</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedField.title}
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {selectedField.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedField.careers.slice(0, 3).map((career, index) => (
                    <Badge key={index} variant="primary">
                      {career.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Field Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore Career Fields</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(careerFields).map(([key, field]) => (
              <Card
                key={key}
                hover
                className={`cursor-pointer transition-all duration-200 ${
                  selectedField?.title === field.title 
                    ? `ring-2 ring-${getFieldColor(key)}-500 bg-${getFieldColor(key)}-50` 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedField(field)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 bg-${getFieldColor(key)}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{field.icon}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {field.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {field.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Career Paths */}
        {selectedField && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Top Career Paths in {selectedField.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedField.careers.map((career, index) => (
                <Card key={index} hover className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {career.title}
                      </h4>
                      <Badge variant={career.growth === 'Very High' ? 'success' : career.growth === 'High' ? 'primary' : 'default'}>
                        {career.growth} Growth
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 flex-grow">
                      {career.description}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="default" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-green-600">
                        {career.salary}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/college-directory')}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Colleges Section */}
        {recommendedColleges.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recommended Colleges for You
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowColleges(!showColleges)}
              >
                {showColleges ? 'Hide' : 'Show'} Colleges ({recommendedColleges.length})
              </Button>
            </div>

            {showColleges && (
              <>
                {/* College Filters */}
                <Card className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Annual Fee (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 100000"
                        value={collegeFilters.maxFee}
                        onChange={(e) => setCollegeFilters(prev => ({ ...prev, maxFee: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <FilterDropdown
                      label="State"
                      options={states}
                      value={collegeFilters.state}
                      onChange={(e) => setCollegeFilters(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="All States"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hostel"
                        checked={collegeFilters.hostel}
                        onChange={(e) => setCollegeFilters(prev => ({ ...prev, hostel: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="hostel" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hostel Available
                      </label>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => setCollegeFilters({ maxFee: '', state: '', hostel: false })}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* College Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterColleges().map((college) => (
                    <Card key={college._id} hover className="h-full">
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                              {college.name}
                            </h4>
                            <Badge variant="primary" size="sm">
                              {college.type || 'Government'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {college.city}, {college.state}
                          </p>
                        </div>

                        {/* Fees Information */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Fees</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(college.fees?.annual || 0)}
                            </span>
                          </div>
                        </div>

                        {/* Courses */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Courses:</p>
                          <div className="flex flex-wrap gap-1">
                            {college.courses?.slice(0, 2).map((course, index) => (
                              <Badge key={index} variant="default" size="sm">
                                {course.name || course}
                              </Badge>
                            ))}
                            {college.courses?.length > 2 && (
                              <Badge variant="default" size="sm">
                                +{college.courses.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Hostel Info */}
                        {college.hostel?.available && (
                          <div className="mb-4">
                            <Badge variant="success" size="sm">
                              🏠 Hostel Available
                            </Badge>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-auto flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => window.open(college.website, '_blank')}
                          >
                            Website
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => navigate('/college-directory')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {filterColleges().length === 0 && (
                  <Card className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No colleges match your filters</h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria.</p>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate('/college-directory')}
          >
            Explore All Government Colleges
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/timeline')}
          >
            View Admission Timeline
          </Button>
        </div>
      </div>
    </div>
  )
}
