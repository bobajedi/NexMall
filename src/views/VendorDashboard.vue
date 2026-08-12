<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { normalizeImportedRow } from '../utils/productImport'
import { 
  currentUser, 
  products, 
  orders, 
  logoutUser, 
  deleteProduct, 
  saveProductsToStorage, 
  saveOrdersToStorage,
  users, 
  saveUsersToStorage, 
  approveVendor, 
  partnerApplications,
  currentLang,
  activeModal,
  activeShopName,
  activeVendorProfile,
  updateVendorProfile,
  categories,
  addCategoryGlobal,
  tickets,
  createTicket,
  replyTicket,
  adminReplyInputs
} from '../store/productStore'

export default {
  name: 'VendorDashboard',
  setup() {
    const lang = currentLang
    const router = useRouter()

    const viewingShopName = ref(null)

    const form = ref({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      images: []
    })

    const excelInput = ref(null)
    const excelUploadMessage = ref('')

    const triggerExcelUpload = () => {
      excelInput.value?.click()
    }

    const ticketForm = ref({
      subject: '',
      message: ''
    })

    const newCategoryInput = ref('')

    const handleAddNewCategory = () => {
      const res = addCategoryGlobal(newCategoryInput.value)
      if (res.success) {
        newCategoryInput.value = ''
      } else {
        alert(res.message)
      }
    }

    const currentActiveShop = computed(() => {
      if (viewingShopName.value) return viewingShopName.value
      return currentUser.value?.shopName || 'NexMall'
    })

    const vendorProducts = computed(() => {
      return products.value.filter(p => p.shopName === currentActiveShop.value)
    })

    const filteredOrders = computed(() => {
      return orders.value.filter(o => o.shopName === currentActiveShop.value)
    })

    const totalEarnings = computed(() => {
      return filteredOrders.value
        .filter(o => o.status === 'Tamamlandı' || o.status === 'E Përfunduar')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    })

    const pendingVendors = computed(() => {
      return users.value
        .filter(u => u.role === 'vendor' && u.status === 'pending')
        .map(user => {
          const partnerApp = partnerApplications.value.find(p => p.email?.toLowerCase() === user.email?.toLowerCase())
          return {
            ...user,
            shopName: user.shopName || partnerApp?.companyName || '',
            name: user.name || partnerApp?.contactName || '',
            shopCategory: user.shopCategory || partnerApp?.shopCategory || '',
            shopAddress: user.shopAddress || partnerApp?.shopAddress || '',
            shopPhone: user.shopPhone || partnerApp?.shopPhone || partnerApp?.phone || '',
            phone: user.shopPhone || partnerApp?.shopPhone || partnerApp?.phone || '',
            address: user.shopAddress || partnerApp?.shopAddress || '',
            whatsappNumber: user.whatsappNumber || partnerApp?.whatsappNumber || ''
          }
        })
    })

    const usersPanelCollapsed = ref(true)
    const supportTicketsCollapsed = ref(true)
    const productsExpanded = ref(true)

    const vendorTickets = computed(() => {
      if (!currentUser.value) return []
      return tickets.value.filter(t => t.senderEmail === currentUser.value.email || t.shopName === currentUser.value.shopName)
    })

    // --- SİLME FONKSİYONLARI ---

    // 1. Satıcının (veya incelenen mağazanın) TÜM ürünlerini silme
    const handleClearAllMyProducts = () => {
      const shopToClear = currentActiveShop.value
      const confirmMsg = lang.value === 'en'
        ? `⚠️ WARNING: Are you sure you want to delete ALL products belonging to "${shopToClear}"?`
        : `⚠️ KUJDES: A jeni të sigurt që dëshironi të fshini TË GJITHA produktet e dyqanit "${shopToClear}"?`

      if (confirm(confirmMsg)) {
        products.value = products.value.filter(p => p.shopName !== shopToClear)
        saveProductsToStorage()
        alert(lang.value === 'en' ? 'All products for this shop have been deleted!' : 'Të gjitha produktet e këtij dyqani u fshinë!')
      }
    }

    // 2. Admin'in sistemdeki TÜM ürünleri toplu silmesi
    const handleClearAllSystemProducts = () => {
      const confirmMsg = lang.value === 'en'
        ? '⚠️ ADMIN WARNING: Are you sure you want to delete ALL products in the ENTIRE system?'
        : '⚠️ KUJDES ADMIN: A jeni të sigurt që dëshironi të fshini TË GJITHA produktet në të gjithë sistemin?'

      if (confirm(confirmMsg)) {
        products.value = []
        saveProductsToStorage()
        alert(lang.value === 'en' ? 'All system products have been deleted!' : 'Të gjitha produktet e sistemit u fshinë!')
      }
    }

    const handleFileUpload = (e) => {
      const files = e.target.files
      if (!files) return
      form.value.images = []
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.onload = (uploadEvent) => {
          form.value.images.push(uploadEvent.target.result)
        }
        reader.readAsDataURL(files[i])
      }
    }

    const addImportedProducts = (drafts, sourceLabel, allowZeroPrice = true) => {
      let added = 0
      let skipped = 0

      drafts.forEach((draft) => {
        const hasValidName = draft?.name && String(draft.name).trim().length > 0
        const hasValidPrice = allowZeroPrice ? true : Number(draft.price) > 0

        if (!hasValidName || !hasValidPrice) {
          skipped += 1
          return
        }

        const newProduct = {
          id: Date.now() + Math.floor(Math.random() * 1000) + added,
          name: String(draft.name || draft.Name || '').trim().toUpperCase(),
          price: Number(draft.price || draft.Price || draft.Cmimi || draft.Fiyat) || 0,
          stock: Number(draft.stock || draft.Stock || draft.Stoku) || 0,
          shopName: currentActiveShop.value,
          category: draft.category || draft.Category || draft.Kategoria || 'TË GJITHA',
          description: draft.description || draft.Description || draft.Pershkrimi || draft.Aciklama || '',
          images: draft.images || draft.Images || ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500']
        }

        products.value.push(newProduct)
        added += 1
      })

      if (added > 0) {
        saveProductsToStorage()
      }

      alert(
        lang.value === 'en'
          ? `${added} products imported from ${sourceLabel}. ${skipped} rows skipped.`
          : `${added} produkte u importuan nga ${sourceLabel}. ${skipped} rreshta u anashkaluan.`
      )
    }

    const handleExcelUpload = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        const XLSX = await import('xlsx')
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (!rows.length) {
          alert(lang.value === 'en' ? 'Excel file is empty.' : 'Skedari Excel është bosh.')
          return
        }

        const drafts = rows
          .map((row) => normalizeImportedRow(row))
          .filter((row) => row?.name)

        addImportedProducts(drafts, 'Excel', true)
        excelUploadMessage.value = lang.value === 'en'
          ? `${drafts.length} products added from Excel.`
          : `${drafts.length} produkte u shtuan nga Excel.`
      } catch (error) {
        console.error(error)
        alert(lang.value === 'en' ? 'Unable to parse the Excel file.' : 'Nuk u mund të analizonte skedarin Excel.')
        excelUploadMessage.value = lang.value === 'en'
          ? 'Excel upload failed.'
          : 'Ngarkimi i Excel dështoi.'
      } finally {
        e.target.value = ''
      }
    }

    const handleProfileAvatarUpload = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        const res = updateVendorProfile({ avatar: uploadEvent.target.result })
        if (res.success) {
          activeVendorProfile.value = { ...currentUser.value }
        }
      }
      reader.readAsDataURL(file)
    }

    const handleCreateProduct = () => {
      if (!form.value.name || !form.value.price || !form.value.stock) {
        alert(lang.value === 'en' ? 'Please fill all required fields!' : 'Ju lutemi plotësoni të gjitha fushat e kërkuara!')
        return
      }

      const newProduct = {
        id: Date.now(),
        name: form.value.name.toUpperCase(),
        price: Number(form.value.price),
        stock: Number(form.value.stock),
        shopName: currentActiveShop.value,
        category: form.value.category || 'TË GJITHA',
        description: form.value.description,
        images: form.value.images.length > 0 ? form.value.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']
      }

      products.value.push(newProduct)
      saveProductsToStorage()

      form.value = { name: '', price: '', stock: '', category: '', description: '', images: [] }
      alert(lang.value === 'en' ? 'Product successfully published!' : 'Produkti u publikua me sukses!')
    }

    const handleDeleteProduct = (productId) => {
      if (confirm(lang.value === 'en' ? 'Are you sure you want to delete this product?' : 'A jeni i sigurt që dëshironi ta fshini këtë produkt?')) {
        deleteProduct(productId)
      }
    }

    const updateOrderStatus = () => {
      saveOrdersToStorage()
    }

    const inspectUserShop = (user) => {
      viewingShopName.value = user.shopName
      activeVendorProfile.value = user
    }

    const returnToAdminPanel = () => {
      viewingShopName.value = null
      activeVendorProfile.value = currentUser.value ? { ...currentUser.value } : null
    }

    const rejectVendor = (email) => {
      const index = users.value.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
      if (index > -1) {
        users.value.splice(index, 1)
        saveUsersToStorage()
      }
    }

    const openVendorProfile = (vendor) => {
      if (!vendor?.email) return
      activeModal.value = null
      router.push({ name: 'admin-vendor-detail', params: { email: encodeURIComponent(vendor.email) } })
    }

    const handleDeleteUser = (email) => {
      if (confirm(lang.value === 'en' ? 'Are you sure you want to delete this user?' : 'A jeni i sigurt që dëshironi ta fshini këtë përdorues?')) {
        const index = users.value.findIndex(u => u.email === email)
        if (index > -1) {
          users.value.splice(index, 1)
          saveUsersToStorage()
        }
      }
    }

    const handleSendTicket = () => {
      if (!ticketForm.value.subject || !ticketForm.value.message) return
      createTicket(ticketForm.value.subject, ticketForm.value.message)
      ticketForm.value.subject = ''
      ticketForm.value.message = ''
      alert(lang.value === 'en' ? 'Support message sent successfully!' : 'Mesazhi i mbështetjes u dërgua me sukses!')
    }

    const handleAdminReply = (ticketId) => {
      const replyText = adminReplyInputs.value[ticketId]
      if (!replyText) return
      replyTicket(ticketId, replyText)
      adminReplyInputs.value[ticketId] = ''
    }

    const exportToCSV = () => {
      let csvContent = "data:text/csv;charset=utf-8,ID,Product Name,Price,Stock,Category\n"
      vendorProducts.value.forEach(p => {
        csvContent += `${p.id},"${p.name}",${p.price},${p.stock},"${p.category}"\n`
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${currentActiveShop.value}_products.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const handleLogout = () => {
      logoutUser()
      window.location.href = '/'
    }

    if (currentUser.value) {
      activeVendorProfile.value = { ...currentUser.value }
    }

    return {
      currentUser,
      products,
      orders,
      form,
      ticketForm,
      newCategoryInput,
      categories,
      viewingShopName,
      activeModal,
      activeShopName,
      activeVendorProfile,
      adminReplyInputs,
      vendorProducts,
      filteredOrders,
      totalEarnings,
      pendingVendors,
      vendorTickets,
      usersPanelCollapsed,
      supportTicketsCollapsed,
      tickets,
      users,
      lang,
      handleFileUpload,
      handleProfileAvatarUpload,
      handleCreateProduct,
      handleDeleteProduct,
      handleClearAllMyProducts,
      handleClearAllSystemProducts,
      updateOrderStatus,
      inspectUserShop,
      returnToAdminPanel,
      openVendorProfile,
      approveVendor,
      rejectVendor,
      handleDeleteUser,
      handleAddNewCategory,
      handleSendTicket,
      handleAdminReply,
      excelInput,
      excelUploadMessage,
      triggerExcelUpload,
      handleExcelUpload,
      productsExpanded,
      handleLogout
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Top Header -->
      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="relative group">
            <img 
              :src="activeVendorProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'" 
              class="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200 shadow-sm" 
            />
            <label v-if="!viewingShopName" class="absolute inset-0 bg-black/40 text-white text-[9px] font-black uppercase flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-2xl cursor-pointer">
              {{ lang === 'en' ? 'Change' : 'Ndrysho' }}
              <input type="file" accept="image/*" @change="handleProfileAvatarUpload" class="hidden" />
            </label>
          </div>
          <div>
            <span class="text-[10px] font-black bg-[#d61f43]/10 text-[#d61f43] px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
              {{ currentUser?.role === 'admin' && !viewingShopName ? (lang === 'en' ? '⚙️ System Administrator Panel (Admin)' : '⚙️ Paneli i Administratorit të Sistemit (Admin)') : (lang === 'en' ? '🏪 Vendor Management Panel' : '🏪 Paneli i Menaxhimit të Shitësit') }}
            </span>
            <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              {{ viewingShopName ? (lang === 'en' ? `🔍 Inspection Mode: ${viewingShopName}` : `🔍 Mënyra e Shqyrtimit: ${viewingShopName}`) : (currentUser?.shopName || currentUser?.name || 'NexMall Store') }}
              <span v-if="viewingShopName" class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg font-bold">
                {{ lang === 'en' ? 'Admin Mode' : 'Mënyra e Administratorit' }}
              </span>
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button v-if="viewingShopName" @click="returnToAdminPanel" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase rounded-xl transition shadow-sm">
            {{ lang === 'en' ? '← Back to Admin Panel' : '← Kthehu te Paneli i Adminit' }}
          </button>
          <router-link to="/" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black uppercase rounded-xl transition">
            {{ lang === 'en' ? 'Return to Home' : 'Kthehu në Kryefaqe' }}
          </router-link>
          <button @click="handleLogout" class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase rounded-xl transition shadow-sm">
            {{ lang === 'en' ? 'Logout' : 'Shkyçu' }}
          </button>
        </div>
      </div>

      <!-- ADMIN VIEW -->
      <div v-if="currentUser?.role === 'admin' && !viewingShopName" class="space-y-8">
        
        <!-- Stats Modals Triggers -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div @click="activeModal = 'allProducts'" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition group">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-gray-900 transition">
                {{ lang === 'en' ? 'Total Products' : 'Produktet Totale' }}
              </p>
              <h3 class="text-2xl font-black text-gray-900 mt-1">{{ products.length }}</h3>
            </div>
            <span class="p-3 bg-blue-50 text-blue-600 rounded-2xl text-lg group-hover:bg-blue-100 transition">📦</span>
          </div>

          <div @click="activeModal = 'allUsers'" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition group">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-gray-900 transition">
                {{ lang === 'en' ? 'Users' : 'Përdoruesit' }}
              </p>
              <h3 class="text-2xl font-black text-gray-900 mt-1">{{ users.length }}</h3>
            </div>
            <span class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-lg group-hover:bg-emerald-100 transition">👥</span>
          </div>

          <div @click="activeModal = 'pendingApps'" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition group">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-gray-900 transition">
                {{ lang === 'en' ? 'Pending Applications' : 'Aplikimet në Pritje' }}
              </p>
              <h3 class="text-2xl font-black text-amber-600 mt-1">{{ pendingVendors.length }}</h3>
            </div>
            <span class="p-3 bg-amber-50 text-amber-600 rounded-2xl text-lg group-hover:bg-amber-100 transition">⏳</span>
          </div>

          <div @click="activeModal = 'supportTickets'" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-900 transition group">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-gray-900 transition">
                {{ lang === 'en' ? 'Support Tickets' : 'Kërkesat e Mbështetjes' }}
              </p>
              <h3 class="text-2xl font-black text-gray-900 mt-1">{{ tickets.length }}</h3>
            </div>
            <span class="p-3 bg-purple-50 text-purple-600 rounded-2xl text-lg group-hover:bg-purple-100 transition">💬</span>
          </div>
        </div>

        <!-- Categories Section -->
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            🗂️ {{ lang === 'en' ? 'Manage and Add System Categories' : 'Menaxho dhe Shto Kategoritë e Sistemit' }}
          </h2>
          <div class="flex flex-col sm:flex-row gap-3">
            <input 
              v-model="newCategoryInput" 
              type="text" 
              :placeholder="lang === 'en' ? 'New Category Name (e.g., BAGS, SPORTS)...' : 'Emri i Kategorisë së Re (p.sh. ÇANTA, SPOR)...'" 
              class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase outline-none focus:border-gray-900"
            />
            <button @click="handleAddNewCategory" class="px-6 py-2.5 bg-gray-950 hover:bg-gray-800 text-white font-black text-xs uppercase rounded-xl transition shadow-sm">
              {{ lang === 'en' ? 'Add Category ➕' : 'Shto Kategori ➕' }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2 pt-2">
            <span v-for="cat in categories" :key="cat" class="px-3 py-1.5 bg-gray-100 text-gray-800 text-[10px] font-black uppercase rounded-lg border border-gray-200">
              {{ cat }}
            </span>
          </div>
        </div>

        <!-- Pending Applications Section -->
        <div v-if="pendingVendors.length > 0" class="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 space-y-4">
          <h2 class="text-sm font-black text-amber-900 uppercase tracking-wider border-b border-amber-200 pb-2">
            ⏳ {{ lang === 'en' ? 'Pending Vendor Applications' : 'Aplikimet e Shitësve në Pritje të Miratimit' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="ven in pendingVendors" :key="ven.email" class="bg-white p-4 rounded-2xl border border-amber-200 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img :src="ven.avatar" class="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 class="text-xs font-black text-gray-900 uppercase">{{ ven.name }}</h4>
                  <p class="text-[11px] font-bold text-gray-500">{{ lang === 'en' ? 'Shop:' : 'Dyqani:' }} {{ ven.shopName }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="approveVendor(ven.email)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase rounded-xl transition">
                  {{ lang === 'en' ? 'Approve ✓' : 'Mirato ✓' }}
                </button>
                <button @click="rejectVendor(ven.email)" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-black text-[10px] uppercase rounded-xl transition">
                  {{ lang === 'en' ? 'Reject ✕' : 'Refuzo ✕' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Tickets Admin Section -->
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 sm:border-b-0 sm:pb-0">
              💬 {{ lang === 'en' ? 'Vendor Support Tickets & Chat Replies' : 'Kërkesat e Mbështetjes së Shitësve dhe Përgjigjja e Bisedës' }}
            </h2>
            <button @click="supportTicketsCollapsed = !supportTicketsCollapsed" class="rounded-full border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
              {{ supportTicketsCollapsed ? (lang === 'en' ? 'Expand Tickets' : 'Zgjeroni Kërkesat') : (lang === 'en' ? 'Collapse Tickets' : 'Mbyll Kërkesat') }}
            </button>
          </div>

          <div v-if="supportTicketsCollapsed" class="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-[10px] uppercase tracking-[0.28em] text-gray-500">{{ lang === 'en' ? 'Support tickets are collapsed to keep the admin panel light.' : 'Kërkesat e mbështetjes janë mbyllur për të mbajtur panelin e adminit më të lehtë.' }}</p>
                <p class="mt-2 text-2xl font-black text-slate-900">{{ tickets.length }} {{ lang === 'en' ? 'tickets hidden' : 'kërkesa të fshehura' }}</p>
              </div>
              <p class="text-xs text-gray-500 max-w-xl">
                {{ lang === 'en' ? 'Open this section only when you need to answer or review support tickets, so the page stays fast with many records.' : 'Hapni këtë seksion vetëm kur të duhet të përgjigjeni ose rishikoni kërkesat e mbështetjes, në mënyrë që faqja të qëndrojë e shpejtë me shumë të dhëna.' }}
              </p>
            </div>
          </div>

          <div v-if="!supportTicketsCollapsed" class="space-y-4">
            <div v-if="tickets.length > 0" class="space-y-4">
              <div v-for="t in tickets" :key="t.id" class="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <div class="flex justify-between items-center text-xs font-black">
                  <span class="text-gray-900 uppercase">👤 {{ t.senderName }} (<span class="text-[#d61f43]">{{ t.shopName }}</span>) — {{ lang === 'en' ? 'Subject:' : 'Subjekti:' }} {{ t.subject }}</span>
                  <span class="text-[10px] text-gray-400 font-mono">{{ t.date }}</span>
                </div>
                <p class="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200/60 font-medium">
                  {{ lang === 'en' ? 'Vendor Message:' : 'Mesazhi i Shitësit:' }} {{ t.message }}
                </p>

                <div v-if="t.adminReply" class="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                  <span class="font-black uppercase block text-[10px] text-blue-600 mb-0.5">
                    {{ lang === 'en' ? 'Admin Reply:' : 'Përgjigjja e Adminit:' }}
                  </span>
                  {{ t.adminReply }}
                </div>

                <div class="flex gap-2 pt-1">
                  <input 
                    v-model="adminReplyInputs[t.id]" 
                    type="text" 
                    :placeholder="lang === 'en' ? 'Write a reply to the vendor...' : 'Shkruaj përgjigjje për shitësin...'" 
                    class="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-gray-900"
                  />
                  <button @click="handleAdminReply(t.id)" class="px-4 py-2 bg-gray-950 hover:bg-gray-800 text-white font-black text-xs uppercase rounded-xl transition">
                    {{ lang === 'en' ? 'Send ✉️' : 'Dërgo ✉️' }}
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-xs font-bold text-gray-400 uppercase">
              {{ lang === 'en' ? 'No active support tickets found.' : 'Nuk ka kërkesa aktive mbështetjeje.' }}
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 sm:border-b-0 sm:pb-0">
              👥 {{ lang === 'en' ? 'System Users & Shops (Connect with Full Authorization)' : 'Përdoruesit e Sistemit dhe Dyqanet (Lidhu me Autorizim të Plotë)' }}
            </h2>
            <button @click="usersPanelCollapsed = !usersPanelCollapsed" class="rounded-full border border-gray-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
              {{ usersPanelCollapsed ? (lang === 'en' ? 'Expand Users' : 'Zgjeroni Përdoruesit') : (lang === 'en' ? 'Collapse Users' : 'Mbyll Përdoruesit') }}
            </button>
          </div>

          <div v-if="usersPanelCollapsed" class="rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-[10px] uppercase tracking-[0.28em] text-gray-500">{{ lang === 'en' ? 'User list is collapsed for performance.' : 'Lista e përdoruesve është mbyllur për performancë.' }}</p>
                <p class="mt-2 text-2xl font-black text-slate-900">{{ users.length }} {{ lang === 'en' ? 'users hidden' : 'përdorues të fshehur' }}</p>
              </div>
              <p class="text-xs text-gray-500 max-w-xl">
                {{ lang === 'en' ? 'Expand this section only when you need to review or manage users. It keeps the admin panel faster when the system has many accounts.' : 'Zgjeroni këtë seksion vetëm kur të duhet të rishikoni ose menaxhoni përdoruesit. Kjo mban panelin më të shpejtë kur sistemi ka shumë llogari.' }}
              </p>
            </div>
          </div>

          <div v-if="!usersPanelCollapsed" class="overflow-x-auto max-h-[520px] overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-inner">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 text-gray-400 uppercase font-black sticky top-0 z-10">
                <tr>
                  <th class="p-3 rounded-l-xl">{{ lang === 'en' ? 'Name / Shop' : 'Emri / Dyqani' }}</th>
                  <th class="p-3">E-mail</th>
                  <th class="p-3">{{ lang === 'en' ? 'Role / Status' : 'Roli / Statusi' }}</th>
                  <th class="p-3 rounded-r-xl text-right">{{ lang === 'en' ? 'Admin Action' : 'Veprimi i Adminit' }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-bold">
                <tr v-for="u in users" :key="u.email" class="hover:bg-gray-50/50" :class="{ 'cursor-pointer bg-blue-50/50': activeVendorProfile?.email === u.email && u.shopName && u.role === 'vendor', 'cursor-pointer': u.shopName && u.role === 'vendor' }" @click="u.shopName && u.role === 'vendor' && inspectUserShop(u)">
                  <td class="p-3 flex items-center gap-3">
                    <img :src="u.avatar" class="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <span class="text-gray-900 font-black uppercase block">{{ u.name }}</span>
                      <span class="text-[10px] text-gray-400">{{ u.shopName || (lang === 'en' ? 'No Shop' : 'Pa Dyqan') }}</span>
                    </div>
                  </td>
                  <td class="p-3 text-gray-600 font-mono">{{ u.email }}</td>
                  <td class="p-3">
                    <span class="px-2 py-1 rounded-md text-[10px] uppercase" :class="u.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                      {{ u.role }} — {{ u.status }}
                    </span>
                  </td>
                  <td class="p-3 text-right space-x-2">
                    <button v-if="u.email !== 'admin@shopaz.com'" @click.stop="handleDeleteUser(u.email)" class="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-[10px] uppercase transition">
                      {{ lang === 'en' ? 'Delete 🗑️' : 'Fshi 🗑️' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- VENDOR VIEW / INSPECTION VIEW -->
      <div v-if="currentUser?.role === 'vendor' || viewingShopName" class="space-y-8">
        
        <!-- Vendor Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {{ lang === 'en' ? 'Total Revenue' : 'Qarkullimi Total' }}
              </p>
              <h3 class="text-2xl font-black text-gray-900 mt-1">€{{ totalEarnings.toFixed(2) }}</h3>
            </div>
            <span class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-lg">💰</span>
          </div>

          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {{ lang === 'en' ? 'Shop Products' : 'Produktet e Dyqanit' }}
              </p>
              <h3 class="text-2xl font-black text-gray-900 mt-1">{{ vendorProducts.length }}</h3>
            </div>
            <span class="p-3 bg-blue-50 text-blue-600 rounded-2xl text-lg">📦</span>
          </div>

          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {{ lang === 'en' ? 'Reporting' : 'Raportimi' }}
              </p>
              <button @click="exportToCSV" class="mt-1 px-3 py-1.5 bg-gray-900 hover:bg-[#d61f43] text-white text-[11px] font-black uppercase rounded-xl transition">
                {{ lang === 'en' ? '📥 Download Excel / CSV' : '📥 Shkarko Excel / CSV' }}
              </button>
            </div>
            <span class="p-3 bg-purple-50 text-purple-600 rounded-2xl text-lg">📊</span>
          </div>
        </div>

        <!-- Vendor Messaging to Admin -->
        <div v-if="!viewingShopName" class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            💬 {{ lang === 'en' ? 'Support & Messaging Center with Administrator' : 'Qendra e Mbështetjes dhe Mesazheve me Administratorin' }}
          </h2>

          <div v-if="vendorTickets.length > 0" class="space-y-3">
            <div v-for="t in vendorTickets" :key="t.id" class="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-2">
              <div class="flex justify-between items-center text-xs font-black">
                <span class="text-gray-900 uppercase">{{ lang === 'en' ? 'Subject:' : 'Subjekti:' }} {{ t.subject }}</span>
                <span class="px-2 py-0.5 rounded text-[9px] uppercase" :class="t.status === 'Yanıtlandı' || t.status === 'Përgjigjur' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                  {{ t.status }}
                </span>
              </div>
              <p class="text-xs text-gray-700 font-medium">
                {{ lang === 'en' ? 'Your Message:' : 'Mesazhi Juaj:' }} {{ t.message }}
              </p>
              
              <div v-if="t.adminReply" class="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                <span class="font-black uppercase block text-[10px] text-blue-600 mb-0.5">
                  {{ lang === 'en' ? 'Admin Reply:' : 'Përgjigjja e Adminit:' }}
                </span>
                {{ t.adminReply }}
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSendTicket" class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <input 
              v-model="ticketForm.subject" 
              type="text" 
              :placeholder="lang === 'en' ? 'Subject (e.g. Technical Support)' : 'Subjekti (p.sh. Mbështetje Teknike)'" 
              required 
              class="px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gray-900" 
            />
            <input 
              v-model="ticketForm.message" 
              type="text" 
              :placeholder="lang === 'en' ? 'Write your message to admins...' : 'Shkruani mesazhin tuaj për administratorët...'" 
              required 
              class="sm:col-span-2 px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-gray-900" 
            />
            <button type="submit" class="sm:col-span-3 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase rounded-xl transition">
              {{ lang === 'en' ? 'Send Message to Admin 🚀' : 'Dërgo Mesazh te Administrata 🚀' }}
            </button>
          </form>
        </div>

        <!-- Excel Upload & Product Creation Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Excel Upload Section -->
          <div class="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              📥 {{ lang === 'en' ? 'Quick Excel Upload' : 'Hızlı Excel Yükleme' }}
            </h2>
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <button type="button" @click="triggerExcelUpload" class="inline-flex items-center justify-center px-6 py-3 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md">
                {{ lang === 'en' ? 'Select Excel / CSV and Upload' : 'Excel / CSV Seç ve Yükle' }}
              </button>
              <span v-if="excelUploadMessage" class="text-[11px] font-bold text-gray-700">
                {{ excelUploadMessage }}
              </span>
            </div>
            <input ref="excelInput" type="file" accept=".xlsx,.xls,.csv" @change="handleExcelUpload" class="hidden" />
          </div>
          
          <!-- Add Product Form -->
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-fit space-y-4">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              ➕ {{ lang === 'en' ? 'Add Product' : 'Shto Produkt' }}
            </h2>

            <form @submit.prevent="handleCreateProduct" class="space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase text-gray-400">
                  {{ lang === 'en' ? 'Product Name' : 'Emri i Produktit' }}
                </label>
                <input v-model="form.name" type="text" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl uppercase transition bg-gray-50 focus:bg-white" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase text-gray-400">
                  {{ lang === 'en' ? 'Select Category' : 'Zgjidh Kategorinë' }}
                </label>
                <select v-model="form.category" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl uppercase transition bg-gray-50 focus:bg-white">
                  <option disabled value="">{{ lang === 'en' ? 'Select Category' : 'Zgjidhni Kategorinë' }}</option>
                  <option v-for="cat in categories.filter(c => c !== 'TË GJITHA')" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase text-gray-400">
                    {{ lang === 'en' ? 'Price (€)' : 'Çmimi (€)' }}
                  </label>
                  <input v-model.number="form.price" type="number" step="0.01" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl transition bg-gray-50 focus:bg-white" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black uppercase text-gray-400">
                    {{ lang === 'en' ? 'Stock' : 'Stoku' }}
                  </label>
                  <input v-model.number="form.stock" type="number" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl transition bg-gray-50 focus:bg-white" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase text-gray-400">
                  {{ lang === 'en' ? 'Description' : 'Përshkrimi' }}
                </label>
                <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl transition bg-gray-50 focus:bg-white"></textarea>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase text-gray-400">
                  {{ lang === 'en' ? 'Select Images' : 'Zgjidh Foto' }}
                </label>
                <input type="file" multiple accept="image/*" @change="handleFileUpload" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white cursor-pointer" />
                <p class="text-[10px] text-emerald-600 font-bold mt-1" v-if="form.images.length > 0">
                  ✓ {{ form.images.length }} {{ lang === 'en' ? 'images selected.' : 'foto të zgjedhura.' }}
                </p>
              </div>

              <button type="submit" class="w-full py-3 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md">
                💾 {{ lang === 'en' ? 'Publish Product' : 'Publiko Produktin' }}
              </button>
            </form>
          </div>

          <!-- Product Management List -->
          <div class="lg:col-span-2 space-y-6">
            
            <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <!-- Header with Delete All Button -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider">
                  🏷️ {{ lang === 'en' ? 'Store Products & Stock Status' : 'Produktet në Dyqan dhe Gjendja e Stokut' }} ({{ vendorProducts.length }})
                </h2>
                <div class="flex items-center gap-2">
                  <button 
                    v-if="vendorProducts.length > 0"
                    type="button" 
                    @click="handleClearAllMyProducts" 
                    class="bg-red-600 hover:bg-red-700 text-white font-black px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95">
                    🗑️ {{ lang === 'en' ? 'Delete All Shop Products' : 'Fshi Të Gjitha Produktet e Dyqanit' }}
                  </button>
                  <button type="button" @click="productsExpanded = !productsExpanded" class="text-[10px] font-black uppercase text-gray-600 hover:text-gray-900 transition border border-gray-200 px-2.5 py-1 rounded-lg">
                    {{ productsExpanded ? (lang === 'en' ? 'Collapse' : 'Mbyll') : (lang === 'en' ? 'Expand' : 'Zgjero') }}
                  </button>
                </div>
              </div>

              <div v-if="vendorProducts.length > 0" v-show="productsExpanded" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="product in vendorProducts" :key="product.id" class="border border-gray-100 bg-gray-50 rounded-2xl p-3 flex gap-3 items-start justify-between">
                  <div class="flex items-start gap-3 min-w-0">
                    <img :src="product.images[0]" class="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0" />
                    <div class="min-w-0">
                      <h4 class="text-[11px] font-black text-gray-900 uppercase flex items-center gap-2 truncate">
                        {{ product.name }}
                        <span v-if="product.stock <= 3" class="px-1.5 py-0.5 bg-red-100 text-red-600 text-[8px] rounded font-black animate-pulse">
                          ⚠️ {{ product.stock }}
                        </span>
                      </h4>
                      <p class="text-[10px] font-bold text-[#d61f43] mt-0.5">
                        €{{ product.price }} | {{ lang === 'en' ? 'Stock' : 'Stoku' }}: {{ product.stock }}
                      </p>
                      <p v-if="product.description" class="text-[10px] text-gray-600 mt-1 truncate">
                        {{ product.description }}
                      </p>
                    </div>
                  </div>
                  <button type="button" @click="handleDeleteProduct(product.id)" class="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-black text-[9px] uppercase rounded-lg transition shrink-0">
                    {{ lang === 'en' ? 'Delete Product' : 'Fshi Produktin' }}
                  </button>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-400 text-xs font-bold uppercase">
                {{ lang === 'en' ? 'No products in this shop yet.' : 'Nuk ka ende produkte në këtë dyqan.' }}
              </div>
            </div>

            <!-- Incoming Orders Section -->
            <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
                📦 {{ lang === 'en' ? 'Incoming Orders & Shipping Status' : 'Porositë e Ardhura dhe Statusi i Dërgesës' }}
              </h2>

              <div v-if="filteredOrders.length > 0" class="space-y-4">
                <div v-for="order in filteredOrders" :key="order.id" class="border border-gray-100 bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div class="flex justify-between items-center border-b border-gray-200/60 pb-2">
                    <span class="text-xs font-mono font-black text-gray-900">
                      {{ lang === 'en' ? 'Order:' : 'Porosia:' }} {{ order.id }} | {{ lang === 'en' ? 'Tracking Code:' : 'Kodi i Gjurmimit:' }} <span class="text-[#d61f43]">{{ order.trackingCode }}</span>
                    </span>
                    <select v-model="order.status" @change="updateOrderStatus" class="text-[10px] font-black bg-white border border-gray-200 px-2 py-1 rounded-lg uppercase">
                      <option value="Porosi e Re">{{ lang === 'en' ? 'New Order' : 'Porosi e Re' }}</option>
                      <option value="Duke u Përgatitur">{{ lang === 'en' ? 'Preparing' : 'Duke u Përgatitur' }}</option>
                      <option value="Në Transport">{{ lang === 'en' ? 'Shipped' : 'Në Transport' }}</option>
                      <option value="E Përfunduar">{{ lang === 'en' ? 'Completed' : 'E Përfunduar' }}</option>
                    </select>
                  </div>

                  <div class="text-xs text-gray-600 font-bold space-y-1">
                    <p class="text-gray-900 font-black">
                      👤 {{ lang === 'en' ? 'Customer:' : 'Klienti:' }} {{ order.customerName }} | 📞 {{ lang === 'en' ? 'Phone:' : 'Tel:' }} {{ order.customerPhone }}
                    </p>
                    <p>📍 {{ lang === 'en' ? 'Address:' : 'Adresa:' }} {{ order.customerAddress }}</p>

                    <div class="bg-white p-3 rounded-xl border border-gray-100 mt-2 space-y-1">
                      <ul class="list-disc list-inside space-y-1">
                        <li v-for="item in order.items.filter(i => i.shopName === currentActiveShop)" :key="item.id">
                          {{ item.name }} — {{ item.quantity }} {{ lang === 'en' ? 'Pcs x' : 'Copë x' }} €{{ item.price }} = <span class="text-emerald-600 font-black">€{{ (item.price * item.quantity).toFixed(2) }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-400 text-xs font-bold uppercase">
                {{ lang === 'en' ? 'No orders for this shop.' : 'Nuk ka porosi për këtë dyqan.' }}
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- SYSTEM MODALS (ADMIN) -->
      <div v-if="activeModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white border border-gray-100 w-full max-w-4xl max-h-[85vh] rounded-3xl p-6 md:p-8 overflow-y-auto space-y-6 shadow-2xl relative">
          
          <div class="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 class="text-lg font-black uppercase tracking-wider text-gray-900">
              <span v-if="activeModal === 'allProducts'">📦 {{ lang === 'en' ? 'All System Products' : 'Të gjitha Produktet e Sistemit' }}</span>
              <span v-else-if="activeModal === 'allUsers'">👥 {{ lang === 'en' ? 'All System Users' : 'Të gjithë Përdoruesit e Sistemit' }}</span>
              <span v-else-if="activeModal === 'pendingApps'">⏳ {{ lang === 'en' ? 'Pending Applications' : 'Aplikimet në Pritje' }}</span>
              <span v-else-if="activeModal === 'supportTickets'">💬 {{ lang === 'en' ? 'Support Tickets' : 'Kërkesat e Mbështetjes' }}</span>
            </h3>
            <button @click="activeModal = null" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center text-xs font-bold transition">✕</button>
          </div>

          <!-- All Products Modal -->
          <div v-if="activeModal === 'allProducts'" class="space-y-4">
            <div v-if="products.length > 0" class="flex justify-between items-center bg-red-50 p-3 rounded-2xl border border-red-100">
              <span class="text-xs font-black text-red-800 uppercase">
                🚨 {{ lang === 'en' ? `Total Products in System: ${products.length}` : `Gjithsej Produktet në Sistem: ${products.length}` }}
              </span>
              <button 
                @click="handleClearAllSystemProducts" 
                class="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95">
                🗑️ {{ lang === 'en' ? 'Delete ALL System Products' : 'Fshi të Gjitha Produktet e Sistemit' }}
              </button>
            </div>

            <div v-if="products.length === 0" class="text-center py-12 text-gray-400 text-xs font-bold uppercase">{{ lang === 'en' ? 'No products found.' : 'Nuk u gjet asnjë produkt.' }}</div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="prod in products" :key="prod.id" class="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <img :src="prod.images && prod.images[0]" class="w-14 h-14 object-cover rounded-xl bg-white border border-gray-200" />
                  <div class="space-y-1">
                    <h4 class="text-xs font-black text-gray-900 uppercase">{{ prod.name }}</h4>
                    <div class="text-[10px] text-gray-500 font-bold">{{ lang === 'en' ? 'Shop:' : 'Dyqani:' }} <span class="text-gray-900">{{ prod.shopName || 'NexMall' }}</span></div>
                    <div class="text-xs font-mono font-black text-emerald-600">€{{ prod.price.toFixed(2) }} | {{ lang === 'en' ? 'Stock:' : 'Stoku:' }} {{ prod.stock }}</div>
                  </div>
                </div>
                <button type="button" @click="handleDeleteProduct(prod.id)" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-black text-[10px] uppercase rounded-xl transition">
                  {{ lang === 'en' ? 'Delete Product 🗑️' : 'Fshi Produktin 🗑️' }}
                </button>
              </div>
            </div>
          </div>

          <!-- All Users Modal -->
          <div v-else-if="activeModal === 'allUsers'">
            <div v-if="users.length === 0" class="text-center py-12 text-gray-400 text-xs font-bold uppercase">{{ lang === 'en' ? 'No users found.' : 'Nuk u gjet asnjë përdorues.' }}</div>
            <div v-else class="space-y-3">
              <div v-for="user in users" :key="user.email" class="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" class="w-12 h-12 object-cover rounded-xl bg-white border border-gray-200" />
                  <div class="space-y-1">
                    <h4 class="text-xs font-black text-gray-900 uppercase">{{ user.name }}</h4>
                    <p class="text-[11px] font-mono text-gray-500">{{ user.email }}</p>
                    <span class="inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold" :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                      {{ user.role }} — {{ user.shopName || 'Pa Dyqan' }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button v-if="user.shopName && user.role === 'vendor'" @click="inspectUserShop(user); activeModal = null" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase rounded-xl transition">
                    {{ lang === 'en' ? 'Inspect ⚡' : 'Shqyrto ⚡' }}
                  </button>
                  <button v-if="user.email !== 'admin@shopaz.com'" @click="handleDeleteUser(user.email)" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-black text-[10px] uppercase rounded-xl transition">
                    {{ lang === 'en' ? 'Delete 🗑️' : 'Fshi 🗑️' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Applications Modal -->
          <div v-else-if="activeModal === 'pendingApps'">
            <div v-if="pendingVendors.length === 0" class="text-center py-12 text-gray-400 text-xs font-bold uppercase">{{ lang === 'en' ? 'No pending applications.' : 'Nuk ka aplikime në pritje.' }}</div>
            <div v-else class="space-y-3">
              <div v-for="ven in pendingVendors" :key="ven.email" class="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl transition hover:border-amber-300 cursor-pointer" @click="openVendorProfile(ven)">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div class="flex items-start gap-3">
                    <img :src="ven.avatar" class="w-12 h-12 object-cover rounded-xl bg-white border border-amber-200" />
                    <div class="space-y-1">
                      <h4 class="text-xs font-black text-gray-900 uppercase">{{ ven.name }}</h4>
                      <p class="text-[11px] font-bold text-gray-600">{{ lang === 'en' ? 'Shop:' : 'Dyqani:' }} {{ ven.shopName || '—' }}</p>
                      <p class="text-[10px] font-mono text-gray-400">{{ ven.email }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-600 font-bold">
                    <div class="rounded-xl bg-white/70 px-2.5 py-2 border border-amber-100">
                      <span class="block uppercase text-[9px] text-gray-400">{{ lang === 'en' ? 'Phone' : 'Telefoni' }}</span>
                      {{ ven.shopPhone || ven.phone || '—' }}
                    </div>
                    <div class="rounded-xl bg-white/70 px-2.5 py-2 border border-amber-100">
                      <span class="block uppercase text-[9px] text-gray-400">{{ lang === 'en' ? 'Address' : 'Adresa' }}</span>
                      {{ ven.shopAddress || ven.address || '—' }}
                    </div>
                    <div class="rounded-xl bg-white/70 px-2.5 py-2 border border-amber-100">
                      <span class="block uppercase text-[9px] text-gray-400">{{ lang === 'en' ? 'Category' : 'Kategoria' }}</span>
                      {{ ven.shopCategory || '—' }}
                    </div>
                    <div class="rounded-xl bg-white/70 px-2.5 py-2 border border-amber-100">
                      <span class="block uppercase text-[9px] text-gray-400">WhatsApp</span>
                      {{ ven.whatsappNumber || '—' }}
                    </div>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-amber-100/80 pt-3">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {{ lang === 'en' ? 'Click to open full vendor profile' : 'Kliko për të hapur profilin e plotë të shitësit' }}
                  </p>
                  <div class="flex gap-2">
                    <button type="button" @click.stop="approveVendor(ven.email)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase rounded-xl transition">
                      {{ lang === 'en' ? 'Approve ✓' : 'Mirato ✓' }}
                    </button>
                    <button type="button" @click.stop="rejectVendor(ven.email)" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-black text-[10px] uppercase rounded-xl transition">
                      {{ lang === 'en' ? 'Reject ✕' : 'Refuzo ✕' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Support Tickets Modal -->
          <div v-else-if="activeModal === 'supportTickets'">
            <div v-if="tickets.length === 0" class="text-center py-12 text-gray-400 text-xs font-bold uppercase">{{ lang === 'en' ? 'No support tickets found.' : 'Nuk u gjet asnjë kërkesë mbështetjeje.' }}</div>
            <div v-else class="space-y-4">
              <div v-for="t in tickets" :key="t.id" class="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3">
                <div class="flex justify-between items-center text-xs font-black">
                  <span class="text-gray-900 uppercase">👤 {{ t.senderName }} (<span class="text-[#d61f43]">{{ t.shopName }}</span>) — {{ t.subject }}</span>
                  <span class="text-[10px] text-gray-400 font-mono">{{ t.date }}</span>
                </div>
                <p class="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200/60 font-medium">
                  {{ t.message }}
                </p>
                <div v-if="t.adminReply" class="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
                  <span class="font-black uppercase block text-[10px] text-blue-600 mb-0.5">
                    {{ lang === 'en' ? 'Admin Reply:' : 'Përgjigjja e Adminit:' }}
                  </span>
                  {{ t.adminReply }}
                </div>
                <div class="flex gap-2 pt-1">
                  <input 
                    v-model="adminReplyInputs[t.id]" 
                    type="text" 
                    :placeholder="lang === 'en' ? 'Write a reply to the vendor...' : 'Shkruaj përgjigje për shitësin...'" 
                    class="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-gray-900"
                  />
                  <button @click="handleAdminReply(t.id)" class="px-4 py-2 bg-gray-950 hover:bg-gray-800 text-white font-black text-xs uppercase rounded-xl transition">
                    {{ lang === 'en' ? 'Send ✉️' : 'Dërgo ✉️' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>