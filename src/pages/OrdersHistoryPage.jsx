import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, Package, FileText, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../App'

const OrdersHistoryPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.email}/orders`)
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Fetch orders error:', error)
    }
    setLoading(false)
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'preparing':
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', label: 'In preparazione' }
      case 'ready':
        return { icon: Package, color: 'text-green-500', bg: 'bg-green-100', label: 'Pronto!' }
      case 'completed':
        return { icon: CheckCircle, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Completato' }
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100', label: status }
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate('/')} className="text-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">I miei ordini</h1>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-rolleat-pink border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nessun ordine</h3>
            <p className="text-gray-500 mb-6">Non hai ancora effettuato ordini</p>
            <button
              onClick={() => navigate('/ordina')}
              className="px-6 py-3 bg-gradient-to-r from-rolleat-pink to-rolleat-red text-white rounded-xl font-semibold"
            >
              Ordina ora
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon
              
              return (
                <motion.div
                  key={order.code || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">Ordine #{order.order_number || order.code}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                      <StatusIcon size={14} className={statusInfo.color} />
                      <span className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <p key={i} className="text-sm text-gray-600">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-sm text-gray-400">+{order.items.length - 3} altri</p>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <p className="font-bold text-rolleat-pink">€{parseFloat(order.total).toFixed(2)}</p>
                    <div className="flex gap-2">
                      {order.status !== 'completed' && (
                        <a
                          href={`${API_URL}/api/ordine/${order.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                        >
                          <Clock size={14} />
                          Tracking
                        </a>
                      )}
                      <a
                        href={order.invoice_customer 
                          ? `${API_URL}/api/fattura/${order.code}`
                          : `${API_URL}/api/scontrino/${order.code}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
                      >
                        <FileText size={14} />
                        {order.invoice_customer ? 'Fattura' : 'Scontrino'}
                      </a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersHistoryPage
