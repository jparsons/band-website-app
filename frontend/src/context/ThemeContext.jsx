import { createContext, useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { bandApi } from '../services/api'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

const loadGoogleFont = (fontName) => {
  if (!fontName) return

  const formattedName = fontName.replace(/ /g, '+')
  const linkId = `google-font-${formattedName}`

  // Check if font is already loaded
  if (document.getElementById(linkId)) return

  const link = document.createElement('link')
  link.id = linkId
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

export const ThemeProvider = ({ children }) => {
  const { data: bandData } = useQuery({
    queryKey: ['band'],
    queryFn: async () => {
      const response = await bandApi.getBand()
      return response.data
    },
  })

  useEffect(() => {
    if (bandData) {
      // Apply colors
      document.documentElement.style.setProperty('--primary-color', bandData.primary_color || '#000000')
      document.documentElement.style.setProperty('--secondary-color', bandData.secondary_color || '#ffffff')

      // Load and apply fonts
      const headingFont = bandData.heading_font || 'Inter'
      const bodyFont = bandData.body_font || 'Inter'

      loadGoogleFont(headingFont)
      loadGoogleFont(bodyFont)

      document.documentElement.style.setProperty('--heading-font', `"${headingFont}", sans-serif`)
      document.documentElement.style.setProperty('--body-font', `"${bodyFont}", sans-serif`)
    }
  }, [bandData])

  const value = {
    band: bandData || {},
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
