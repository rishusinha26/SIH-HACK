import React, { createContext, useContext, useState, useRef } from 'react'

const VoiceContext = createContext()

export function VoiceProvider({ children }) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)

  // Check if speech recognition is supported
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (isSupported && recognitionRef.current && !isListening) {
      setTranscript('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text, options = {}) => {
    if (synthesisRef.current) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate || 0.8
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1
      utterance.lang = options.lang || 'en-US'

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        setIsSpeaking(false)
      }

      synthesisRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase()
    
    // Navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
      if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
        window.location.href = '/'
      } else if (lowerCommand.includes('quiz')) {
        window.location.href = '/quiz'
      } else if (lowerCommand.includes('career') || lowerCommand.includes('careers')) {
        window.location.href = '/career-recommendations'
      } else if (lowerCommand.includes('college') || lowerCommand.includes('colleges')) {
        window.location.href = '/college-directory'
      } else if (lowerCommand.includes('profile')) {
        window.location.href = '/profile'
      } else if (lowerCommand.includes('timeline')) {
        window.location.href = '/timeline'
      }
    }
    
    // Search commands
    else if (lowerCommand.includes('search') || lowerCommand.includes('find')) {
      if (lowerCommand.includes('college')) {
        const searchTerm = command.replace(/search|find|college/gi, '').trim()
        if (searchTerm) {
          // Trigger college search
          const event = new CustomEvent('voiceSearch', { detail: { term: searchTerm, type: 'college' } })
          window.dispatchEvent(event)
        }
      }
    }
    
    // Help command
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      speak("I can help you navigate the app, search for colleges, and read content aloud. Try saying 'go to quiz' or 'search for engineering colleges'.")
    }
    
    // Read content commands
    else if (lowerCommand.includes('read') || lowerCommand.includes('speak')) {
      const content = document.querySelector('[data-voice-content]')?.textContent
      if (content) {
        speak(content)
      } else {
        speak("I don't see any content to read. Please navigate to a page with recommendations or college information.")
      }
    }
    
    else {
      speak("I didn't understand that command. Try saying 'help' to see what I can do.")
    }
  }

  return (
    <VoiceContext.Provider value={{
      isListening,
      isSupported,
      transcript,
      isSpeaking,
      startListening,
      stopListening,
      speak,
      stopSpeaking
    }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  return useContext(VoiceContext)
}

