import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNexMallStore = defineStore('nexMall', () => {
  const products = ref(JSON.parse(localStorage.getItem('nexmall_products')) || [])
  const cart = ref(JSON.parse(localStorage.getItem('nexmall_cart')) || [])
  const compareList = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref('Të Gjitha')
  const minRating = ref(0)
  const currency = ref('EUR') 
  const accentColor = ref(localStorage.getItem('nexmall_accent') || '#f59e0b') 
  const activeCoupon = ref(null)
  const notifications = ref([])
  const searchHistory = ref(JSON.parse(localStorage.getItem('nexmall_search_history')) || [])

  const rates = { EUR: 1, USD: 1.09, TRY: 36.5 }

  const triggerToast = (message, type = 'success') => {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 2500)
  }

  const formatPrice = (priceInEur) => {
    const converted = priceInEur * rates[currency.value]
    const symbols = { EUR: '€', USD: '$', TRY: '₺' }
    return `${converted.toFixed(2)} ${symbols[currency.value]}`
  }

  const filteredProducts = computed(() => {
    return products.value.filter(product => {
      const titleSafe = product.title ? product.title.toLowerCase() : ''
      const descSafe = product.description ? product.description.toLowerCase() : ''
      const querySafe = searchQuery.value.toLowerCase()

      const matchesSearch = titleSafe.includes(querySafe) || descSafe.includes(querySafe)
      const matchesCategory = selectedCategory.value === 'Të Gjitha' || product.category === selectedCategory.value
      const matchesRating = (product.rating || 0) >= minRating.value
      
      return matchesSearch && matchesCategory && matchesRating
    })
  })

  const addToCart = (product) => {
    const existing = cart.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
    saveCart()
    triggerToast(`${product.title} u shtua në shportë!`)
  }

  const saveCart = () => localStorage.setItem('nexmall_cart', JSON.stringify(cart.value))

  const toggleCompare = (product) => {
    const index = compareList.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      compareList.value.splice(index, 1)
      triggerToast('Produkti u hoq nga krahasimi.', 'info')
    } else {
      if (compareList.value.length >= 3) {
        triggerToast('Mund të krahasoni deri në 3 produkte!', 'warning')
        return
      }
      compareList.value.push(product)
      triggerToast('Produkti u shtua në listën e krahasimit.')
    }
  }

  const applyCoupon = (code) => {
    if (code.toUpperCase() === 'NEX20') {
      activeCoupon.value = { code: 'NEX20', discount: 0.20 }
      triggerToast('Kuponi i zbritjes prej 20% u aplikua!')
      return true
    }
    triggerToast('Kodi i kuponit është i pavlefshëm!', 'warning')
    return false
  }

  const cartSubtotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  const cartTotal = computed(() => activeCoupon.value ? cartSubtotal.value * (1 - activeCoupon.value.discount) : cartSubtotal.value)

  const generateMockData = () => {
    const categories = ['Teknologji', 'Veshje', 'Shtëpi & Jeta', 'Aksesuar']
    const mockTitles = ['Kufje Pa Fije X', 'Orë e Mençur Premium', 'Çantë Shpine Minimaliste', 'Tastierë Mekanike Pro', 'Gotë Kafeje prej Xhami']
    
    const newProducts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      title: 'Nex' + mockTitles[i % mockTitles.length] + ' ' + (Math.floor(Math.random() * 100)),
      price: Math.floor(Math.random() * 150) + 10,
      category: categories[i % categories.length],
      description: 'Produkt i veçantë NexMall i prodhuar me dizajn të shkëlqyer dhe materiale të cilësisë së lartë.',
      rating: (Math.random() * 2 + 3).toFixed(1),
      image: `https://picsum.photos/300/300?random=${i}`,
      stock: Math.floor(Math.random() * 25)
    }))

    products.value = [...products.value, ...newProducts]
    localStorage.setItem('nexmall_products', JSON.stringify(products.value))
    triggerToast('15 Produkte Testuese u Gjeneruan me Sukses!')
  }

  const addSearchHistory = (query) => {
    if (!query.trim()) return
    searchHistory.value = [query, ...searchHistory.value.filter(h => h !== query)].slice(0, 5)
    localStorage.setItem('nexmall_search_history', JSON.stringify(searchHistory.value))
  }

  return {
    products, cart, compareList, searchQuery, selectedCategory, minRating, currency, accentColor, activeCoupon, notifications, searchHistory,
    filteredProducts, formatPrice, addToCart, toggleCompare, applyCoupon, cartSubtotal, cartTotal, generateMockData, triggerToast, addSearchHistory
  }
})