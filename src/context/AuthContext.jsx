import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carica utente da localStorage
    const savedUser = localStorage.getItem('rolleat_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('rolleat_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://rolleat-kiosk-api-4ln9t.ondigitalocean.app'
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Errore di login')
      }
      
      setUser(data.user)
      localStorage.setItem('rolleat_user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password, name) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://rolleat-kiosk-api-4ln9t.ondigitalocean.app'
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Errore di registrazione')
      }
      
      setUser(data.user)
      localStorage.setItem('rolleat_user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rolleat_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('rolleat_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
