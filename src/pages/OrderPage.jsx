import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Minus, ShoppingCart, MapPin, CreditCard, FileText, X, Check, Edit3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../App'

const OrderPage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [selectedStore, setSelectedStore] = useState(null)
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('roll')
  const [showCart, setShowCart] = useState(false)
  const [wantsInvoice, setWantsInvoice] = useState(false)
  const [status, setStatus] = useState('menu') // menu, paying, confirmed
  const [orderNumber, setOrderNumber] = useState(null)

  // Stato per personalizzazione prodotto
  const [customizingProduct, setCustomizingProduct] = useState(null)
  const [removedIngredients, setRemovedIngredients] = useState([])

  // Menu prodotti con ingredienti
  const menu = {
    roll: [
      { id: 'hawaii', name: 'Roll Hawaii', price: 8.90, desc: 'Salmone, avocado, mango', ingredients: ['Salmone', 'Avocado', 'Mango', 'Riso', 'Alga Nori'] },
      { id: 'tokyo', name: 'Roll Tokyo', price: 9.50, desc: 'Tonno, cetriolo, sesamo', ingredients: ['Tonno', 'Cetriolo', 'Sesamo', 'Riso', 'Alga Nori'] },
      { id: 'california', name: 'Roll California', price: 8.50, desc: 'Surimi, avocado, cetriolo', ingredients: ['Surimi', 'Avocado', 'Cetriolo', 'Riso', 'Alga Nori'] },
      { id: 'dragon', name: 'Roll Dragon', price: 10.90, desc: 'Gambero, avocado, salsa teriyaki', ingredients: ['Gambero', 'Avocado', 'Salsa Teriyaki', 'Riso', 'Alga Nori'] },
      { id: 'veggie', name: 'Roll Veggie', price: 7.90, desc: 'Verdure miste, tofu', ingredients: ['Tofu', 'Carote', 'Cetriolo', 'Avocado', 'Riso', 'Alga Nori'] },
    ],
    bowl: [
      { id: 'poke-salmon', name: 'Poke Salmone', price: 12.90, desc: 'Salmone, riso, edamame, avocado', ingredients: ['Salmone', 'Riso', 'Edamame', 'Avocado', 'Cipolla Rossa', 'Sesamo'] },
      { id: 'poke-tuna', name: 'Poke Tonno', price: 13.90, desc: 'Tonno, riso, mango, cipolla', ingredients: ['Tonno', 'Riso', 'Mango', 'Cipolla Rossa', 'Salsa Soia'] },
      { id: 'buddha', name: 'Buddha Bowl', price: 11.90, desc: 'Quinoa, verdure, hummus', ingredients: ['Quinoa', 'Ceci', 'Hummus', 'Pomodorini', 'Cetriolo', 'Carote'] },
    ],
    insalate: [
      { id: 'green', name: 'Green Salad', price: 9.90, desc: 'Mix verde, avocado, semi', ingredients: ['Mix Insalata', 'Avocado', 'Semi di Zucca', 'Olio EVO'] },
      { id: 'protein', name: 'Protein Salad', price: 11.90, desc: 'Pollo, uova, verdure', ingredients: ['Pollo Grigliato', 'Uova', 'Pomodorini', 'Lattuga', 'Carote'] },
    ],
    snack: [
      { id: 'edamame', name: 'Edamame', price: 4.50, desc: 'Con sale marino', ingredients: ['Edamame', 'Sale Marino'] },
      { id: 'gyoza', name: 'Gyoza (5pz)', price: 6.90, desc: 'Ravioli giapponesi', ingredients: ['Maiale', 'Verdure', 'Pasta Gyoza'] },
    ]
  }

  const categories = [
    { id: 'roll', label: '🍣 Roll', emoji: '🍣' },
    { id: 'bowl', label: '🥗 Bowl', emoji: '🥗' },
    { id: 'insalate', label: '🥬 Insalate', emoji: '🥬' },
    { id: 'snack', label: '🥟 Snack', emoji: '🥟' },
  ]

  // Apre il modal di personalizzazione
  const openCustomizer = (product) => {
    setCustomizingProduct(product)
    setRemovedIngredients([])
  }

  // Toggle ingrediente rimosso
  const toggleIngredient = (ingredient) => {
    setRemovedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    )
  }

  // Conferma prodotto personalizzato
  const confirmCustomization = () => {
    if (!customizingProduct) return

    const customizedProduct = {
      ...customizingProduct,
      cartId: `${customizingProduct.id}-${Date.now()}`, // ID univoco per carrello
      quantity: 1
    }

    // Aggiungi modifiche se presenti
    if (removedIngredients.length > 0) {
      customizedProduct.customizations = {
        removedIngredients: removedIngredients
      }
      customizedProduct.displayName = `${customizingProduct.name} (senza ${removedIngredients.join(', ')})`
    }

    setCart(prev => [...prev, customizedProduct])
    setCustomizingProduct(null)
    setRemovedIngredients([])
  }

  // Aggiunge prodotto senza personalizzazione (incrementa quantità se esiste)
  const addToCartDirect = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && !item.customizations)
      if (existing) {
        return prev.map(item => 
          item.id === product.id && !item.customizations ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, cartId: `${product.id}-${Date.now()}`, quantity: 1 }]
    })
  }

  const removeFromCart = (cartId) => {
    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId)
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
      return prev.filter(item => item.cartId !== cartId)
    })
  }

  const incrementCartItem = (cartId) => {
    setCart(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
    ))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handlePayment = async () => {
    if (!selectedStore) {
      alert('Seleziona una sede')
      return
    }
    
    setStatus('paying')
    
    try {
      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map(item => ({
            name: item.displayName || item.name,
            price: item.price,
            quantity: item.quantity,
            customizations: item.customizations || null
          })),
          kioskSessionId: Date.now().toString(),
          isMobile: true,
          customerEmail: user?.email || null,
          wantsInvoice: wantsInvoice,
          invoiceData: user?.invoiceData || null
        })
      })
      
      const data = await response.json()
      
      if (data.checkoutUrl) {
        // Salva dati ordine per dopo il pagamento
        sessionStorage.setItem('pending_order', JSON.stringify({
          cart,
          total,
          store: selectedStore,
          wantsInvoice,
          invoiceData: user?.invoiceData || null,
          userEmail: user?.email
        }))
        
        // Redirect a Stripe
        window.location.href = data.checkoutUrl
      }
    } catch (error) {
      console.error('Payment error:', error)
      setStatus('menu')
      alert('Errore nel pagamento')
    }
  }

  // Selezione sede
  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft size={20} /> Indietro
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dove vuoi ordinare?</h1>
        <p className="text-gray-500 mb-6">Seleziona la sede per il ritiro</p>
        
        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedStore('arese')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-rolleat-pink to-rolleat-red rounded-xl flex items-center justify-center">
                <MapPin className="text-white" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Arese - Il Centro</h3>
                <p className="text-gray-500">Centro Commerciale Il Centro</p>
              </div>
            </div>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedStore('biella')}
            className="w-full bg-white rounded-2xl p-6 shadow-lg text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-rolleat-green-light to-rolleat-green-dark rounded-xl flex items-center justify-center">
                <MapPin className="text-white" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Biella - Gli Orsi</h3>
                <p className="text-gray-500">Centro Commerciale Gli Orsi</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setSelectedStore(null)} className="flex items-center gap-2 text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Ritiro a</p>
            <p className="font-semibold text-gray-800">
              {selectedStore === 'arese' ? 'Arese' : 'Biella'}
            </p>
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-2"
          >
            <ShoppingCart className="text-gray-600" size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rolleat-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-rolleat-pink text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="p-4 space-y-3">
        {menu[activeCategory]?.map(product => {
          const inCartCount = cart.filter(item => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0)
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1" onClick={() => openCustomizer(product)}>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.desc}</p>
                  {/* Ingredienti */}
                  {product.ingredients && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 3 && (
                        <span className="text-xs text-gray-400">+{product.ingredients.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-rolleat-pink font-bold">€{product.price.toFixed(2)}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openCustomizer(product); }}
                      className="text-xs text-blue-600 flex items-center gap-1"
                    >
                      <Edit3 size={12} /> Personalizza
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {/* Pulsante aggiungi veloce */}
                  <button
                    onClick={() => addToCartDirect(product)}
                    className="w-10 h-10 bg-rolleat-pink text-white rounded-full flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                  {inCartCount > 0 && (
                    <span className="text-xs font-semibold text-rolleat-pink bg-pink-50 px-2 py-0.5 rounded-full">
                      {inCartCount} nel carrello
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Cart Button */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg"
        >
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-4 bg-gradient-to-r from-rolleat-pink to-rolleat-red text-white rounded-xl font-bold flex items-center justify-center gap-3"
          >
            <ShoppingCart size={20} />
            Vai al carrello • €{total.toFixed(2)}
          </button>
        </motion.div>
      )}

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Il tuo ordine</h2>
                
                {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between items-center py-3 border-b">
                    <div className="flex-1">
                      <p className="font-medium">{item.displayName || item.name}</p>
                      {/* Mostra modifiche */}
                      {item.customizations?.removedIngredients?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.customizations.removedIngredients.map((ing, i) => (
                            <span key={i} className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded line-through">
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => incrementCartItem(item.cartId)}
                        className="w-8 h-8 bg-rolleat-pink text-white rounded-full flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Fattura */}
                <button
                  onClick={() => setWantsInvoice(!wantsInvoice)}
                  className={`w-full mt-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    wantsInvoice
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                  }`}
                >
                  <FileText size={20} />
                  {wantsInvoice ? '✓ Fattura richiesta' : 'Richiedi Fattura'}
                </button>

                {/* Totale */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Totale</span>
                    <span className="text-2xl font-bold text-rolleat-pink">€{total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    className="w-full py-4 bg-gradient-to-r from-rolleat-green-light to-rolleat-green-dark text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    Paga €{total.toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Personalizzazione Prodotto */}
      <AnimatePresence>
        {customizingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end"
            onClick={() => setCustomizingProduct(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{customizingProduct.name}</h2>
                  <p className="text-sm text-gray-500">€{customizingProduct.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => setCustomizingProduct(null)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Ingredienti */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Rimuovi ingredienti
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Tocca per rimuovere un ingrediente
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {customizingProduct.ingredients?.map((ingredient) => {
                    const isRemoved = removedIngredients.includes(ingredient)
                    return (
                      <button
                        key={ingredient}
                        onClick={() => toggleIngredient(ingredient)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          isRemoved
                            ? 'bg-red-100 text-red-600 line-through'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {isRemoved ? '✕ ' : '✓ '}{ingredient}
                      </button>
                    )
                  })}
                </div>

                {/* Riepilogo modifiche */}
                {removedIngredients.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                    <p className="text-sm text-amber-800">
                      <strong>Senza:</strong> {removedIngredients.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium"
                >
                  Annulla
                </button>
                <button
                  onClick={confirmCustomization}
                  className="flex-1 py-3 bg-gradient-to-r from-rolleat-pink to-rolleat-red text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Aggiungi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderPage
