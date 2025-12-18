import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Pages
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import ProfilePage from './pages/ProfilePage'
import OrdersHistoryPage from './pages/OrdersHistoryPage'
import LoyaltyPage from './pages/LoyaltyPage'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'

// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'https://rolleat-kiosk-api-4ln9t.ondigitalocean.app'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rolleat-pink border-t-transparent"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/ordina" element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } />
          <Route path="/profilo" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/ordini" element={
            <ProtectedRoute>
              <OrdersHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/punti" element={
            <ProtectedRoute>
              <LoyaltyPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
