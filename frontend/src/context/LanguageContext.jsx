import React, { createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language || 'en')

  const changeLanguage = (lng) => {
    setLanguage(lng)
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en'
    changeLanguage(newLang)
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

