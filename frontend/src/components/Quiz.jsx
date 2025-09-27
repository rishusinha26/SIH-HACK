import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/client.js'
import { useToast } from './ui/Toast.jsx'
import { quizQuestions, calculateScores, getRecommendedStreams } from '../data/quizQuestions'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'

export default function Quiz() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Check if user already has quiz results
    api.get('/quiz/mine').then(({data}) => {
      if (data.result) {
        setResult(data.result)
        setIsCompleted(true)
      }
    }).catch(() => {})
  }, [])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuiz = async () => {
    setLoading(true)
    try {
      const scores = calculateScores(Object.values(answers))
      const recommendedStreams = getRecommendedStreams(scores)
      
      const { data } = await api.post('/quiz/submit', { 
        scores,
        recommendedStreams,
        answers: Object.keys(answers).length
      })
      setResult(data.result)
      setIsCompleted(true)
    } catch (error) {
      console.error('Quiz submission failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
    setIsCompleted(false)
  }

  if (isCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center" data-voice-content>
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('quiz.results')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('quiz.subtitle')}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('quiz.recommendedStreams')}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.recommendedStreams?.map((stream, index) => (
                  <Badge key={stream} variant="primary" size="lg">
                    {stream}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/career-recommendations')}
              >
                {t('quiz.viewRecommendations')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={restartQuiz}
              >
                {t('common.restart')} Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentQ.question}
            </h1>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQ.id]?.text === option.text
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQ.id]?.text === option.text
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQ.id]?.text === option.text && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              {t('common.previous')}
            </Button>

            <div className="flex space-x-2">
              {currentQuestion === quizQuestions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={loading || !answers[currentQ.id]}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? t('common.loading') : t('quiz.submit')}
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[currentQ.id]}
                >
                  {t('quiz.next')}
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigation */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {quizQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[quizQuestions[index].id]
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}