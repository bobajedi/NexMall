<template>
  <div class="min-h-screen bg-[#f4f6f9] text-gray-800 font-sans antialiased selection:bg-[#d61f43]/20 selection:text-[#d61f43] flex flex-col justify-between">
    
    <!-- ÜST BİLGİ BARI -->
    <header class="bg-[#d61f43] text-white text-[11px] font-black tracking-wider py-2 px-8 shadow-sm">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <span>⚡</span>
          <span>{{ lang === 'al' ? 'Transport i shpejtë në të gjithë Kosovën!' : 'Fast shipping all over Kosovo!' }}</span>
        </div>
        
        <div class="flex items-center gap-4 font-bold opacity-90">
          <router-link :to="{ path: '/', hash: '#flash-deals' }" class="hover:underline transition">{{ lang === 'al' ? 'Ofertat e Ditës' : 'Flash Deals' }}</router-link>
          <span>|</span>
          <router-link :to="{ path: '/', hash: '#explore-products' }" class="hover:underline transition">{{ lang === 'al' ? 'Kategoritë' : 'Categories' }}</router-link>
          <span>|</span>
          
          <div class="flex items-center gap-1 font-mono">
            <button @click="setLanguage('al')" :class="['transition font-black', lang === 'al' ? 'underline text-white' : 'text-white/60 hover:text-white']">AL</button>
            <span>/</span>
            <button @click="setLanguage('en')" :class="['transition font-black', lang === 'en' ? 'underline text-white' : 'text-white/60 hover:text-white']">EN</button>
          </div>
        </div>
      </div>
    </header>

    <!-- ANA NAVİGASYON BARI -->
    <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 h-20 flex items-center shadow-sm">
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        <!-- LOGO -->
        <div class="flex items-center shrink-0 h-full py-1">
          <button type="button" @click="router.push('/')" class="flex items-center h-full focus:outline-none cursor-pointer">
            <img src="/src/store/NexMall.png" alt="NexMall Logo" class="h-29 w-auto object-contain hover:opacity-95 transition" />
          </button>
        </div>

        <!-- ARAMA BARI -->
        <div class="flex-1 max-w-xl relative flex items-center mx-2">
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="lang === 'al' ? 'Kërko produkte, dyqane...' : 'Search products, shops...'" 
            class="w-full bg-[#f8fafc] border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d61f43] focus:bg-white focus:ring-2 focus:ring-[#d61f43]/10 transition shadow-inner"
          />
          <button class="absolute right-1.5 p-2 bg-[#d61f43] hover:bg-[#b51433] text-white rounded-full transition shadow-sm active:scale-95 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>

        <!-- SAĞ EYLEM BUTONLARI -->
        <div class="flex items-center gap-3 text-xs font-black uppercase tracking-wider relative">
          
          <router-link to="/" class="hidden md:inline-block hover:text-[#d61f43] text-gray-600 transition mr-1">
            {{ lang === 'al' ? 'Kryefaqja' : 'Home' }}
          </router-link>

          <!-- WISHLIST -->
          <router-link to="/wishlist" class="relative p-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-gray-900 flex items-center gap-1.5 border border-gray-100 shadow-sm" active-class="bg-red-50 text-[#d61f43] border-red-200">
            <span class="text-[#d61f43] transform hover:scale-110 transition">❤️</span>
            <span class="font-mono text-xs font-bold">{{ wishlistCount }}</span>
          </router-link>

          <!-- SEPET -->
          <button @click="isCartOpen = true" class="relative px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-gray-900 flex items-center gap-2 border border-gray-200 shadow-sm active:scale-95 cursor-pointer">
            <span>🛒</span>
            <span class="font-mono text-xs font-bold">€{{ cartTotal.toFixed(2) }}</span>
            <span v-if="cartCount > 0" class="absolute -top-1.5 -right-1.5 bg-[#d61f43] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-[#d61f43]/30 pulse-animation font-mono">
              {{ cartCount }}
            </span>
          </button>
          
          <span class="h-6 w-px bg-gray-200 mx-1"></span>

          <!-- KULLANICI / MENÜ DROPDOWN TOGGLE -->
          <button 
            @click.stop="isDropdownOpen = !isDropdownOpen"
            class="p-2.5 bg-gray-950 text-white rounded-xl hover:bg-gray-800 transition flex items-center justify-center shadow-md focus:outline-none active:scale-95 cursor-pointer"
          >
            <div class="w-4 h-3.5 flex flex-col justify-between relative pointer-events-none">
              <span :class="['w-full h-0.5 bg-white rounded transition-transform duration-300', isDropdownOpen ? 'transform rotate-45 translate-y-1.5' : '']"></span>
              <span :class="['w-full h-0.5 bg-white rounded transition-opacity duration-300', isDropdownOpen ? 'opacity-0' : '']"></span>
              <span :class="['w-full h-0.5 bg-white rounded transition-transform duration-300', isDropdownOpen ? 'transform -rotate-45 -translate-y-1.5' : '']"></span>
            </div>
          </button>

          <!-- DROPDOWN MENÜ -->
          <div 
            v-if="isDropdownOpen" 
            @click.stop
            class="absolute right-0 top-12 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 flex flex-col space-y-1 text-left origin-top-right animate-fade"
          >
            <div v-if="currentUser" class="px-4 py-2.5 border-b border-gray-100 mb-1 bg-slate-50/50">
              <span class="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Kyçur si:</span>
              <span class="text-xs font-black text-slate-950 block truncate mt-0.5">{{ currentUser.name }}</span>
              <span v-if="currentUser.shopName" class="text-[9px] text-[#d61f43] font-black block truncate mt-0.5">🏪 {{ currentUser.shopName }}</span>
            </div>

            <router-link to="/" @click="isDropdownOpen = false" class="md:hidden px-4 py-2 hover:bg-slate-50 text-gray-700 font-bold transition flex items-center gap-2">
              🏠 {{ lang === 'al' ? 'Kryefaqja' : 'Home' }}
            </router-link>

            <router-link 
              v-if="currentUser && (currentUser.role === 'vendor' || currentUser.role === 'admin' || currentUser.role === 'seller')"
              to="/vendor" 
              @click="isDropdownOpen = false"
              class="px-4 py-2 hover:bg-slate-50 text-gray-900 font-black transition flex items-center gap-2"
            >
              📊 {{ lang === 'al' ? 'Paneli i Kontrollit' : 'Dashboard' }}
            </router-link>

            <router-link 
              v-if="currentUser"
              to="/vendor/settings" 
              @click="isDropdownOpen = false"
              class="px-4 py-2 hover:bg-rose-50 text-[#d61f43] font-black transition flex items-center justify-between border-t border-b border-slate-100 my-1"
            >
              <div class="flex items-center gap-2">
                <span>⚙️</span>
                <span>{{ lang === 'al' ? 'Cilësimet e Avancuara' : 'Advanced Settings' }}</span>
              </div>
              <span class="text-[10px] bg-red-100 text-[#d61f43] px-1.5 py-0.5 rounded-full font-mono">PRO</span>
            </router-link>

            <div class="px-4 py-2 flex items-center justify-between border-b border-gray-100 text-[11px] font-bold text-gray-600">
              <span class="flex items-center gap-1.5">🌐 {{ lang === 'al' ? 'Gjuha / Language' : 'Language' }}</span>
              <div class="flex items-center gap-1 font-mono">
                <button @click="setLanguage('al')" :class="['px-1.5 py-0.5 rounded text-[10px]', lang === 'al' ? 'bg-[#d61f43] text-white font-black' : 'bg-gray-100 text-gray-700']">AL</button>
                <button @click="setLanguage('en')" :class="['px-1.5 py-0.5 rounded text-[10px]', lang === 'en' ? 'bg-[#d61f43] text-white font-black' : 'bg-gray-100 text-gray-700']">EN</button>
              </div>
            </div>

            <div class="h-px bg-gray-100 my-1"></div>

            <button 
              v-if="currentUser" 
              @click="handleLogout(); isDropdownOpen = false" 
              class="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-black transition flex items-center gap-2 cursor-pointer"
            >
              🚪 {{ lang === 'al' ? 'Shkyçu' : 'Logout' }}
            </button>
            <router-link 
              v-else 
              to="/login" 
              @click="isDropdownOpen = false"
              class="px-4 py-2 hover:bg-slate-50 text-gray-900 font-black transition flex items-center gap-2"
            >
              🔑 {{ lang === 'al' ? 'Hyni' : 'Login' }}
            </router-link>
          </div>

        </div>

      </div>
    </nav>

    <!-- KATEGORİ ŞERİDİ -->
    <div class="relative z-30 bg-white border-b border-gray-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 md:px-8 flex items-center">
        
        <button 
          type="button" 
          @click="scrollCategories('left')" 
          class="p-2.5 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer shrink-0 font-bold"
        >
          ❮
        </button>

        <div 
          ref="categoryContainer" 
          class="flex items-center gap-2.5 overflow-x-auto py-2.5 px-2 scrollbar-hide flex-1"
        >
          <button
            type="button"
            v-for="(cat, index) in categories"
            :key="'category-' + index"
            @click="onCategoryClick(cat)"
            class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer select-none shrink-0"
            :class="[
              isCategorySelected(cat)
                ? 'bg-[#d61f43] text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <button 
          type="button" 
          @click="scrollCategories('right')" 
          class="p-2.5 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer shrink-0 font-bold"
        >
          ❯
        </button>

      </div>
    </div>

    <!-- SEPET ÇEKMECESİ -->
    <CartDrawer />

    <!-- ANA İÇERİK SAYFASI -->
    <main class="relative flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t border-gray-200 mt-16 py-8 px-4 md:px-8 text-gray-500 text-xs">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="font-black text-gray-900 uppercase tracking-tight">NexMall e-Commerce</span>
          <span>© 2026 — {{ lang === 'al' ? 'Të gjitha të drejtat e rezervuara.' : 'All rights reserved.' }}</span>
        </div>
        <div class="flex items-center gap-6 font-bold">
          <router-link to="/" class="hover:text-[#d61f43] transition">{{ lang === 'al' ? 'Kryefaqja' : 'Home' }}</router-link>
          <router-link :to="{ path: '/', hash: '#explore-products' }" class="hover:text-[#d61f43] transition">{{ lang === 'al' ? 'Produktet' : 'Products' }}</router-link>
          <router-link v-if="currentUser" to="/vendor/settings" class="hover:text-[#d61f43] transition">{{ lang === 'al' ? 'Cilësimet' : 'Settings' }}</router-link>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, watchEffect, provide, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isCartOpen, cart, wishlist, currentUser as globalUser, currentLang, searchQuery, categories, selectedCategory, setSelectedCategory } from './store/productStore'
import CartDrawer from './components/CartDrawer.vue'

const router = useRouter()
const route = useRoute()
const currentUser = ref(null)

const lang = currentLang
const isDropdownOpen = ref(false)

provide('searchQuery', searchQuery)
provide('lang', lang)

const setLanguage = (newLang) => {
  lang.value = newLang
  localStorage.setItem('nexmall_lang', newLang)
}

const categoryContainer = ref(null)

const isCategorySelected = (cat) => {
  const isAll = cat.toLowerCase() === 'të gjitha' || cat.toLowerCase() === 'all'
  if (isAll) {
    return !selectedCategory.value || selectedCategory.value.trim() === ''
  }
  return String(selectedCategory.value).trim().toUpperCase() === String(cat).trim().toUpperCase()
}

const onCategoryClick = (cat) => {
  const isAll = cat.toLowerCase() === 'të gjitha' || cat.toLowerCase() === 'all'
  setSelectedCategory(isAll ? '' : cat)

  if (route.path !== '/') {
    router.push({ path: '/', hash: '#products-section' }).catch(() => {})
  } else {
    nextTick(() => {
      const section = document.getElementById('products-section')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
}

const scrollCategories = (direction) => {
  if (!categoryContainer.value) return
  const scrollAmount = 220
  categoryContainer.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
}

const cartCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0))
const cartTotal = computed(() => cart.value.reduce((total, item) => total + (item.price * item.quantity), 0))
const wishlistCount = computed(() => wishlist.value.length)

watchEffect(() => {
  const user1 = sessionStorage.getItem('currentUser')
  const user2 = sessionStorage.getItem('nexmall_current_user')
  const fallbackUser1 = localStorage.getItem('currentUser')
  const fallbackUser2 = localStorage.getItem('nexmall_current_user')
  
  if (globalUser.value) {
    currentUser.value = globalUser.value
  } else if (user1) {
    currentUser.value = JSON.parse(user1)
  } else if (user2) {
    currentUser.value = JSON.parse(user2)
  } else if (fallbackUser1) {
    currentUser.value = JSON.parse(fallbackUser1)
  } else if (fallbackUser2) {
    currentUser.value = JSON.parse(fallbackUser2)
  } else {
    currentUser.value = null
  }
})

const closeDropdownOnClickOutside = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeDropdownOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside)
})

const handleLogout = () => {
  sessionStorage.removeItem('currentUser')
  sessionStorage.removeItem('nexmall_current_user')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('nexmall_current_user')
  currentUser.value = null
  router.push('/login')
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from { opacity: 0; transform: translateY(4px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

@keyframes customPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(214, 31, 67, 0.4); }
  50% { transform: scale(1.08); box-shadow: 0 0 8px 4px rgba(214, 31, 67, 0); }
}
.pulse-animation { animation: customPulse 2s infinite ease-in-out; }

@keyframes fadeInMenu {
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-fade { animation: fadeInMenu 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>