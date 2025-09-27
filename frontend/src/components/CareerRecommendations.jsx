import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import api from '../api/client'
import { aptitudeProfiles, careerFields } from '../data/careerData'

export default function CareerRecommendations() {
  const navigate = useNavigate()
  const [quizResult, setQuizResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedField, setSelectedField] = useState(null)

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
      }
    } catch (error) {
      console.error('Failed to load quiz result:', error)
    } finally {
      setLoading(false)
    }
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
                      onClick={() => navigate('/colleges')}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate('/colleges')}
          >
            Explore Government Colleges
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
