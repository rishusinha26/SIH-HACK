import React, { useState, useEffect } from 'react'
import { useVoice } from '../context/VoiceContext.jsx'
import { useTranslation } from 'react-i18next'

export default function VoiceAssistant() {
  const { isListening, isSupported, transcript, isSpeaking, startListening, stopListening, speak } = useVoice()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    const handleVoiceSearch = (event) => {
      // Handle voice search events
      console.log('Voice search:', event.detail)
    }

    window.addEventListener('voiceSearch', handleVoiceSearch)
    return () => window.removeEventListener('voiceSearch', handleVoiceSearch)
  }, [])

  if (!isSupported) {
    return null
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const readRecommendations = () => {
    const content = document.querySelector('[data-voice-content]')?.textContent
    if (content) {
      speak(content)
    } else {
      speak("No recommendations found to read. Please complete the quiz first.")
    }
  }

  return (
    <>
      {/* Voice Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end space-y-2">
          {/* Transcript Display */}
          {showTranscript && transcript && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">You said:</span> {transcript}
              </p>
            </div>
          )}

          {/* Voice Assistant Panel */}
          {isOpen && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Voice Assistant
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleListening}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z" />
                        </svg>
                        <span>Stop Listening</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span>Start Listening</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={readRecommendations}
                    disabled={isSpeaking}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSpeaking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Speaking...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        <span>Read Recommendations</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={showTranscript}
                      onChange={(e) => setShowTranscript(e.target.checked)}
                      className="rounded"
                    />
                    <span>Show transcript</span>
                  </label>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Try saying:</p>
                  <ul className="space-y-1">
                    <li>• "Go to quiz"</li>
                    <li>• "Search for engineering colleges"</li>
                    <li>• "Read recommendations"</li>
                    <li>• "Help"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Main Voice Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : isSpeaking
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isListening ? (
              <div className="w-6 h-6 bg-white rounded-sm" />
            ) : isSpeaking ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

