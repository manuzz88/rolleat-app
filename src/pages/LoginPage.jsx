import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isLogin) {
        result = await login(email, password)
      } else {
        if (!name.trim()) {
          setError('Inserisci il tuo nome')
          setLoading(false)
          return
        }
        result = await register(email, password, name)
      }

      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Errore di connessione')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rolleat-pink via-rolleat-red to-rolleat-pink flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-rolleat-pink to-rolleat-red rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🍣</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Rolleat</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Il tuo nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rolleat-pink focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rolleat-pink focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-rolleat-pink focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-rolleat-pink to-rolleat-red text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Caricamento...
              </span>
            ) : (
              isLogin ? 'Accedi' : 'Registrati'
            )}
          </motion.button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-rolleat-pink font-semibold ml-1"
            >
              {isLogin ? 'Registrati' : 'Accedi'}
            </button>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">Perché registrarsi?</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2">
              <span className="text-2xl">⭐</span>
              <p className="text-xs text-gray-500 mt-1">Punti fedeltà</p>
            </div>
            <div className="p-2">
              <span className="text-2xl">📜</span>
              <p className="text-xs text-gray-500 mt-1">Storico ordini</p>
            </div>
            <div className="p-2">
              <span className="text-2xl">🧾</span>
              <p className="text-xs text-gray-500 mt-1">Fatture salvate</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
