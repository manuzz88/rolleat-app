import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Gift, TrendingUp, Award } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../App'

const LoyaltyPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const points = user?.points || 0
  const nextReward = 100
  const progress = Math.min((points / nextReward) * 100, 100)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/loyalty/${user.email}`)
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error('Fetch history error:', error)
    }
    setLoading(false)
  }

  const rewards = [
    { points: 50, reward: '€2.50 di sconto', icon: '🎁' },
    { points: 100, reward: '€5 di sconto', icon: '🎉' },
    { points: 200, reward: '€12 di sconto', icon: '⭐' },
    { points: 500, reward: 'Roll gratis', icon: '🍣' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 pb-20 rounded-b-[40px]">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="text-white/80">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">Punti fedeltà</h1>
        </div>
        
        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="text-white" size={48} />
          </div>
          <p className="text-white/80 text-sm">I tuoi punti</p>
          <p className="text-5xl font-bold">{points}</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="px-4 -mt-12">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Prossimo premio</span>
            <span className="text-sm font-semibold text-amber-600">{nextReward - points} punti</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {points}/{nextReward} punti per €5 di sconto
          </p>
        </div>
      </div>

      {/* Come funziona */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-amber-500" />
          Come funziona
        </h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4 py-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🛒</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Ordina</p>
              <p className="text-sm text-gray-500">1€ speso = 1 punto</p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🎁</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Riscatta</p>
              <p className="text-sm text-gray-500">100 punti = €5 di sconto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premi disponibili */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Gift size={20} className="text-amber-500" />
          Premi disponibili
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {rewards.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-4 shadow-sm text-center ${
                points >= item.points ? 'ring-2 ring-amber-500' : ''
              }`}
            >
              <span className="text-3xl">{item.icon}</span>
              <p className="font-bold text-gray-800 mt-2">{item.points} pt</p>
              <p className="text-xs text-gray-500">{item.reward}</p>
              {points >= item.points && (
                <span className="inline-block mt-2 px-2 py-1 bg-amber-100 text-amber-600 text-xs rounded-full font-medium">
                  Disponibile!
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Storico */}
      <div className="px-4 mt-6 pb-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Award size={20} className="text-amber-500" />
          Storico punti
        </h2>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-500">Nessun movimento</p>
            <p className="text-sm text-gray-400 mt-1">I tuoi punti appariranno qui</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {history.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{item.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('it-IT')}
                  </p>
                </div>
                <span className={`font-bold ${item.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoyaltyPage
