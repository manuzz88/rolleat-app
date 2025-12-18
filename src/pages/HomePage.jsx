import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, User, History, Star, LogOut, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { icon: ShoppingBag, label: 'Ordina', desc: 'Ordina il tuo roll preferito', path: '/ordina', color: 'from-rolleat-pink to-rolleat-red' },
    { icon: History, label: 'I miei ordini', desc: 'Storico e tracking', path: '/ordini', color: 'from-blue-500 to-blue-600' },
    { icon: Star, label: 'Punti fedeltà', desc: `${user?.points || 0} punti`, path: '/punti', color: 'from-amber-500 to-orange-500' },
    { icon: User, label: 'Profilo', desc: 'Dati e fatturazione', path: '/profilo', color: 'from-rolleat-green-light to-rolleat-green-dark' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rolleat-pink to-rolleat-red text-white p-6 pb-16 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm">Ciao,</p>
            <h1 className="text-2xl font-bold">{user?.name || 'Utente'} 👋</h1>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="p-2 bg-white/20 rounded-full"
          >
            <LogOut size={20} />
          </button>
        </div>
        
        {/* Punti */}
        <div className="mt-4 bg-white/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">I tuoi punti</p>
            <p className="text-3xl font-bold">{user?.points || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Prossimo premio</p>
            <p className="font-semibold">100 punti = €5</p>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 -mt-8">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-2xl p-5 shadow-lg text-left hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-3`}>
                <item.icon className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-gray-800">{item.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sedi */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-800 mb-3">📍 Le nostre sedi</h2>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <MapPin className="text-rolleat-pink" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Arese - Il Centro</h3>
              <p className="text-sm text-gray-500">Centro Commerciale Il Centro</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="text-rolleat-green-dark" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Biella - Gli Orsi</h3>
              <p className="text-sm text-gray-500">Centro Commerciale Gli Orsi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 mt-4 text-center">
        <p className="text-gray-400 text-xs">Rolleat © 2024 - Fresh & Healthy Food</p>
      </div>
    </div>
  )
}

export default HomePage
