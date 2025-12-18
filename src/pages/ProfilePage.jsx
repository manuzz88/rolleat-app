import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Building, FileText, Save, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../App'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [name, setName] = useState(user?.name || '')
  const [invoiceData, setInvoiceData] = useState(user?.invoiceData || {
    ragioneSociale: '',
    partitaIva: '',
    codiceSDI: '',
    pec: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch(`${API_URL}/api/users/${user.email}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, invoiceData })
      })
      
      if (response.ok) {
        updateUser({ name, invoiceData })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
    
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate('/')} className="text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Il mio profilo</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 bg-gradient-to-r from-rolleat-pink to-rolleat-red rounded-full flex items-center justify-center mb-3">
            <User className="text-white" size={48} />
          </div>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* Dati personali */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} className="text-rolleat-pink" />
            Dati personali
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rolleat-pink focus:outline-none"
                placeholder="Il tuo nome"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-600">
                <Mail size={18} />
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* Dati fatturazione */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building size={20} className="text-blue-600" />
            Dati fatturazione (opzionale)
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Salva i tuoi dati per richiedere fattura più velocemente
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Ragione Sociale</label>
              <input
                type="text"
                value={invoiceData.ragioneSociale}
                onChange={(e) => setInvoiceData({...invoiceData, ragioneSociale: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Nome azienda"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Partita IVA</label>
              <input
                type="text"
                value={invoiceData.partitaIva}
                onChange={(e) => setInvoiceData({...invoiceData, partitaIva: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="12345678901"
                maxLength={11}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Codice SDI</label>
              <input
                type="text"
                value={invoiceData.codiceSDI}
                onChange={(e) => setInvoiceData({...invoiceData, codiceSDI: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="ABC1234"
                maxLength={7}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">PEC (alternativa a SDI)</label>
              <input
                type="email"
                value={invoiceData.pec}
                onChange={(e) => setInvoiceData({...invoiceData, pec: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="azienda@pec.it"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-rolleat-pink to-rolleat-red text-white'
          }`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : saved ? (
            <>
              <Check size={20} />
              Salvato!
            </>
          ) : (
            <>
              <Save size={20} />
              Salva modifiche
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default ProfilePage
