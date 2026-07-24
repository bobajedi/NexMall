import { ref, computed } from 'vue'

export const currentLang = ref('al')
export const activeModal = ref(null)
export const activeShopName = ref('')
export const activeVendorProfile = ref(null)
export const adminReplyInputs = ref({})

// Gelişmiş Arama ve Filtreleme State'leri
export const searchQuery = ref('')
export const selectedCategory = ref('TË GJITHA')
export const sortBy = ref('default') // 'default', 'price-asc', 'price-desc', 'name'
export const minPrice = ref(null)
export const maxPrice = ref(null)

const savedProducts = localStorage.getItem('products')
const savedOrders = localStorage.getItem('orders')
const savedWishlist = localStorage.getItem('wishlist')
const savedCart = localStorage.getItem('cart')
const savedUsers = localStorage.getItem('nexmall_users')
const savedPartners = localStorage.getItem('nexmall_partner_applications')
const savedTickets = localStorage.getItem('nexmall_tickets')
const savedCategories = localStorage.getItem('nexmall_categories')

const getStoredUser = () => {
  const u1 = localStorage.getItem('currentUser')
  if (u1) return JSON.parse(u1)
  const u2 = localStorage.getItem('nexmall_current_user')
  if (u2) return JSON.parse(u2)
  return null
}

export const currentUser = ref(getStoredUser())

export const categories = ref(savedCategories ? JSON.parse(savedCategories) : [
  'TË GJITHA', 'VESHJE', 'KËPUCË', 'AKSESUAR', 'T-SHIRT', 'ELEKTRONIKE'
])

export const saveCategoriesToStorage = () => {
  localStorage.setItem('nexmall_categories', JSON.stringify(categories.value))
}

export const addCategoryGlobal = (catName) => {
  const formatted = catName.trim().toUpperCase()
  if (formatted && !categories.value.includes(formatted)) {
    categories.value.push(formatted)
    saveCategoriesToStorage()
    return { success: true }
  }
  return { success: false, message: 'Kjo kategori ekziston tashmë ose është e pavlefshme!' }
}

export const products = ref(savedProducts ? JSON.parse(savedProducts) : [
  { 
    id: 1, 
    name: 'T-SHIRT ARMANI', 
    price: 34.99, 
    stock: 2, 
    shopName: 'BUTIQUE NADI', 
    category: 'T-SHIRT',
    description: '%100 pambuk, i prodhuar nga pëlhurë e cilësisë së lartë.',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'] 
  },
  { 
    id: 2, 
    name: 'LED PENDANT LIGHT', 
    price: 89.99, 
    stock: 12, 
    shopName: 'HOME LIGHTING', 
    category: 'ELEKTRONIKE',
    description: 'Llambë văngëse moderne për sallon dhe kuzhinë.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'] 
  }
])

// Filtrelenmiş ve Sıralanmış Ürünler (Computed)
export const filteredProducts = computed(() => {
  let result = [...products.value]

  // 1. Kategori Filtresi
  if (selectedCategory.value && selectedCategory.value !== 'TË GJITHA') {
    result = result.filter(p => p.category?.toUpperCase() === selectedCategory.value.toUpperCase())
  }

  // 2. Metin / Arama Filtresi (İsim, Açıklama veya Mağaza Adına göre)
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.shopName && p.shopName.toLowerCase().includes(query))
    )
  }

  // 3. Fiyat Aralığı Filtresi
  if (minPrice.value !== null && minPrice.value !== '') {
    result = result.filter(p => p.price >= Number(minPrice.value))
  }
  if (maxPrice.value !== null && maxPrice.value !== '') {
    result = result.filter(p => p.price <= Number(maxPrice.value))
  }

  // 4. Sıralama (Sorting)
  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

export const orders = ref(savedOrders ? JSON.parse(savedOrders) : [])
export const cart = ref(savedCart ? JSON.parse(savedCart) : [])
export const isCartOpen = ref(false)
export const wishlist = ref(savedWishlist ? JSON.parse(savedWishlist) : [])
export const tickets = ref(savedTickets ? JSON.parse(savedTickets) : [
  {
    id: 'TCK-1001',
    senderEmail: 'edi@gmail.com',
    senderName: 'Edi Bobaj',
    shopName: 'BUTIQUE NADI',
    subject: 'Lidhur me Pagesën',
    message: 'Kur kalojnë pagesat e mia në llogari?',
    adminReply: 'Përshëndetje Edi, pagesat bëhen çdo të hënë.',
    status: 'E Përgjigjur',
    date: '22.07.2026'
  }
])

export const saveTicketsToStorage = () => {
  localStorage.setItem('nexmall_tickets', JSON.stringify(tickets.value))
}

export const createTicket = (subject, message) => {
  if (!currentUser.value) return
  const newTicket = {
    id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
    senderEmail: currentUser.value.email,
    senderName: currentUser.value.name,
    shopName: currentUser.value.shopName || 'Klient',
    subject,
    message,
    adminReply: '',
    status: 'Në Pritje',
    date: new Date().toLocaleDateString('sq-AL')
  }
  tickets.value.unshift(newTicket)
  saveTicketsToStorage()
}

export const replyTicket = (ticketId, replyText) => {
  const t = tickets.value.find(item => item.id === ticketId)
  if (t) {
    t.adminReply = replyText
    t.status = 'E Përgjigjur'
    saveTicketsToStorage()
  }
}

export const updateVendorProfile = (updatedData) => {
  if (!currentUser.value) return { success: false, message: 'Nuk është hapur asnjë sesion!' }
  
  currentUser.value.name = updatedData.name || currentUser.value.name
  currentUser.value.shopName = updatedData.shopName || currentUser.value.shopName
  if (updatedData.avatar) {
    currentUser.value.avatar = updatedData.avatar
  }
  
  const userInList = users.value.find(u => u.email === currentUser.value.email)
  if (userInList) {
    userInList.name = currentUser.value.name
    userInList.shopName = currentUser.value.shopName
    userInList.avatar = currentUser.value.avatar
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  localStorage.setItem('nexmall_current_user', JSON.stringify(currentUser.value))
  saveUsersToStorage()

  return { success: true, message: 'Profilo u përditësua me sukses!' }
}

export const addToCartGlobal = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++
    } else {
      alert('Nuk ka më produkte në stok!')
    }
  } else {
    if (product.stock > 0) {
      cart.value.push({ ...product, quantity: 1 })
    } else {
      alert('Produkti nuk është në stok!')
    }
  }
  saveCartToStorage()
}

export const saveCartToStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

export const toggleWishlist = (product) => {
  const index = wishlist.value.findIndex(item => item.id === product.id)
  if (index > -1) {
    wishlist.value.splice(index, 1)
  } else {
    wishlist.value.push(product)
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist.value))
}

export const checkoutSubmitGlobal = (customerData) => {
  if (cart.value.length === 0) return { success: false, message: 'Shporta është e zbrazët!' }

  const shopsInCart = [...new Set(cart.value.map(item => item.shopName))]

  shopsInCart.forEach(shop => {
    const shopItems = cart.value.filter(item => item.shopName === shop)
    const totalAmount = shopItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      shopName: shop,
      date: new Date().toLocaleDateString('sq-AL'),
      status: 'Porosi e Re', 
      trackingCode: 'TRK-' + Math.floor(10000000 + Math.random() * 90000000),
      totalAmount: totalAmount,
      customerName: customerData.name,
      customerEmail: currentUser.value?.email || customerData.email || 'misafir@nexmall.com',
      customerPhone: customerData.phone,
      customerAddress: customerData.address,
      customerNote: customerData.note,
      items: shopItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        shopName: item.shopName
      }))
    }

    orders.value.push(newOrder)
  })

  cart.value.forEach(item => {
    const prod = products.value.find(p => p.id === item.id)
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity)
    }
  })

  saveOrdersToStorage()
  saveProductsToStorage()
  cart.value = []
  saveCartToStorage()
  return { success: true }
}

export const partnerApplications = ref(savedPartners ? JSON.parse(savedPartners) : [])
export const savePartnersToStorage = () => {
  localStorage.setItem('nexmall_partner_applications', JSON.stringify(partnerApplications.value))
}

export const updatePartnerStatus = (id, status) => {
  const partner = partnerApplications.value.find(p => p.id === id)
  if (partner) {
    partner.status = status
    savePartnersToStorage()
    
    if (status === 'approved') {
      const existingUser = users.value.find(u => u.email.toLowerCase() === partner.email.toLowerCase())
      if (!existingUser) {
        const newVendorUser = {
          email: partner.email,
          password: '123', 
          name: partner.contactName || 'Partner',
          role: 'vendor',
          shopName: partner.companyName || 'DYQAN I RI PARTNER',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          status: 'approved'
        }
        users.value.push(newVendorUser)
        saveUsersToStorage()
      } else {
        existingUser.status = 'approved'
        saveUsersToStorage()
      }
    }
    return true
  }
  return false
}

export const approveVendor = (email) => {
  const partner = partnerApplications.value.find(p => p.email.toLowerCase() === email.toLowerCase())
  if (partner) {
    partner.status = 'approved'
    savePartnersToStorage()
  }

  const user = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (user) {
    user.status = 'approved'
    saveUsersToStorage()
    return true
  }
  return false
}

const defaultUsers = [
  { 
    email: 'admin@shopaz.com', 
    password: '123', 
    name: 'Administratori i Sistemit', 
    role: 'admin', 
    shopName: 'Paneli i Adminit', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    status: 'approved' 
  },
  { 
    email: 'edi@gmail.com', 
    password: '123', 
    name: 'Edi Bobaj', 
    role: 'vendor', 
    shopName: 'BUTIQUE NADI', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'approved' 
  },
  { 
    email: 'nashpajko@gmail.com', 
    password: '123', 
    name: 'Nash Pajko', 
    role: 'vendor', 
    shopName: 'HOME LIGHTING', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'approved' 
  }
]

const loadedUsers = savedUsers ? JSON.parse(savedUsers) : defaultUsers
if (!loadedUsers.some(u => u.email === 'admin@shopaz.com')) {
  loadedUsers.unshift(defaultUsers[0])
}

export const users = ref(loadedUsers)

export const saveUsersToStorage = () => {
  localStorage.setItem('nexmall_users', JSON.stringify(users.value))
}

export const loginUser = (email, password) => {
  const found = users.value.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (found) {
    if (found.status === 'pending') {
      return { success: false, message: 'Aplikimi juaj për dyqan nuk është aprovuar ende nga administratori!' }
    }
    currentUser.value = found
    localStorage.setItem('currentUser', JSON.stringify(found))
    localStorage.setItem('nexmall_current_user', JSON.stringify(found))
    return { success: true }
  }
  return { success: false, message: 'E-posta ose fjalëkalimi është i gabuar!' }
}

export const registerUser = (userData) => {
  const existing = users.value.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
  if (existing) {
    return { success: false, message: 'Kjo adresë e-postë është tashmë në përdorim!' }
  }

  const newUser = {
    email: userData.email,
    password: userData.password,
    name: userData.name || 'Shitës',
    role: userData.role || 'vendor',
    shopName: userData.shopName || userData.name || 'DYQAN I RI',
    avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    status: userData.role === 'customer' ? 'approved' : 'pending' 
  }

  users.value.push(newUser)
  saveUsersToStorage()

  if (newUser.role === 'vendor') {
    const newPartnerApp = {
      id: 'PAR-' + Math.floor(1000 + Math.random() * 9000),
      companyName: newUser.shopName,
      contactName: newUser.name,
      email: newUser.email,
      phone: '+383 44 000 000',
      message: 'Regjistrimi i shitësit u krijua direkt përmes platformës.',
      status: 'pending',
      date: new Date().toLocaleDateString('sq-AL')
    }
    partnerApplications.value.push(newPartnerApp)
    savePartnersToStorage()
  }

  return { success: true, message: 'Regjistrimi u krye me sukses! Mund të kyçeni.' }
}

export const logoutUser = () => {
  currentUser.value = null
  localStorage.removeItem('currentUser')
  localStorage.removeItem('nexmall_current_user')
}

export const saveOrdersToStorage = () => {
  localStorage.setItem('orders', JSON.stringify(orders.value))
}

export const saveProductsToStorage = () => {
  localStorage.setItem('products', JSON.stringify(products.value))
}

export const deleteProduct = (productId) => {
  const index = products.value.findIndex(p => p.id === productId)
  if (index > -1) {
    products.value.splice(index, 1)
    saveProductsToStorage()
    return true
  }
  return false
}