<template>
  <div class="min-h-screen bg-gray-50 pb-20">

    <div class="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <div class="lg:col-span-8 relative bg-gradient-to-r from-gray-950 via-gray-900 to-[#d61f43] rounded-3xl overflow-hidden shadow-xl text-white p-8 md:p-10 flex flex-col justify-between">
          <div class="space-y-3 max-w-lg z-10">
            <span class="inline-block px-3 py-1 bg-white text-gray-950 text-[9px] font-black uppercase tracking-widest rounded-full shadow">
              🔥 OFERTA MEGA E SEZONIT
            </span>
            <h1 class="text-2xl md:text-4xl font-black tracking-tight uppercase leading-tight">
              LOKALET MË TË MIRA TË KOSOVËS 
            </h1>
            <p class="text-xs text-gray-200 font-medium">
              Ulje marramendëse në produkte të zgjedhura dhe dërgesë e shpejtë në derë për të gjitha porositë.
            </p>
          </div>
          <div class="pt-4 z-10 flex items-center gap-3">
            <a href="#products-section" class="px-6 py-3 bg-white text-gray-950 hover:bg-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition shadow-md">
              EKSPLORO OFERTAT →
            </a>
          </div>
          <div class="absolute right-4 bottom-4 text-7xl opacity-15 select-none pointer-events-none flex items-center justify-between w-full md:w-auto gap-6">
            <router-link to="/" class="flex items-center overflow-visible py-1 pointer-events-auto">
              <img src="/src/store/NexMall.png" alt="NexMall Logo" class="h-70 w-auto max-h-70 object-contain scale-125 origin-right drop-shadow-lg" />
            </router-link>
          </div>
        </div>

        <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div class="bg-gradient-to-br from-[#d61f43] to-red-900 rounded-3xl p-5 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
            <div class="space-y-1 z-10">
              <span class="px-2 py-0.5 bg-white/20 text-white text-[8px] font-black uppercase tracking-widest rounded">
                FUSHATË SPECIALE
              </span>
              <h3 class="text-base font-black uppercase">ULJE NETO %50</h3>
              <p class="text-[10px] text-white/90">Mundësi e artë në artikujt e modës.</p>
            </div>
            <span class="text-3xl z-10">⚡</span>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-lg flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-[9px] font-black text-[#d61f43] uppercase tracking-wider">ANE MBERANE KOSOVËS</span>
              <h3 class="text-xs font-black text-gray-950 uppercase">TRANSPORT FALAS</h3>
              <p class="text-[10px] text-gray-400 font-bold">Dërgesë e shpejtë dhe e sigurt</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-red-50 text-[#d61f43] flex items-center justify-center text-xl font-black">
              🚚
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-8 mt-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        <div class="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 class="text-xs font-black text-gray-950 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
              🗂️ KATEGORITË
            </h3>
            <div class="space-y-2">
              <button 
                v-for="cat in categories" 
                :key="cat"
                @click="selectedCategory = cat"
                :class="[
                  'w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-between',
                  selectedCategory === cat 
                    ? 'bg-gray-950 text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                ]"
              >
                <span>{{ cat }}</span>
                <span class="text-[10px] opacity-60">›</span>
              </button>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 class="text-xs font-black text-gray-950 uppercase tracking-widest">
                🏷️ LOKALET
              </h3>
              <button v-if="selectedBrands.length > 0" @click="selectedBrands = []" class="text-[9px] font-black text-[#d61f43] uppercase hover:underline">
                Pastro
              </button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <label v-for="brand in dynamicBrands" :key="brand" class="flex items-center gap-3 text-xs font-bold text-gray-700 cursor-pointer p-1 hover:text-gray-950">
                <input type="checkbox" v-model="selectedBrands" :value="brand" class="rounded border-gray-300 text-[#d61f43] focus:ring-0" />
                <span class="uppercase">{{ brand }}</span>
              </label>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-5">
            <h3 class="text-xs font-black text-gray-950 uppercase tracking-widest pb-3 mb-3">
              💶 ÇMIMI (€)
            </h3>
            <div class="flex items-center gap-2">
              <input 
                v-model.number="minPrice" 
                type="number" 
                placeholder="Min" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-gray-950 outline-none"
              />
              <span class="text-gray-400 font-bold">-</span>
              <input 
                v-model.number="maxPrice" 
                type="number" 
                placeholder="Max" 
                class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-gray-950 outline-none"
              />
            </div>
          </div>
        </div>

        <div id="products-section" class="lg:col-span-3 space-y-6">

          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-black text-gray-950 uppercase tracking-wide">{{ selectedCategory }}</h2>
              <p class="text-[10px] text-gray-400 font-bold mt-0.5">{{ filteredProducts.length }} produkte u gjetën</p>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <select 
                v-model="sortBy" 
                class="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-gray-950 outline-none cursor-pointer"
              >
                <option value="default">Rreshtimi Parazgjedhur</option>
                <option value="price-asc">Çmimi: Nga më i oltji te më i larti</option>
                <option value="price-desc">Çmimi: Nga më i larti te më i oltji</option>
                <option value="name">Emri: A-Z</option>
              </select>

              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Kërko produkt..." 
                class="w-full md:w-56 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:border-gray-950 outline-none"
              />
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="bg-white p-16 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
            <span class="text-4xl block">🔍</span>
            <h3 class="text-xs font-black text-gray-950 uppercase">Nuk u gjet asnjë produkt</h3>
            <p class="text-[10px] text-gray-400 font-bold">Provo të ndryshosh kriteret e kërkimit ose çmimit.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id" 
              class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
            >
              <div class="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" @click="goToDetail(product.id)">
                <img 
                  v-if="product.images && product.images.length > 0" 
                  :src="product.images[0]" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
                <div v-else class="w-full h-full flex items-center justify-center text-3xl">📦</div>

                <span class="absolute top-3 left-3 bg-[#d61f43] text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                  -%35
                </span>

                <button 
                  @click.stop="toggleWishlist(product)"
                  class="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-xs shadow-sm hover:bg-white transition"
                >
                  {{ isWishlisted(product.id) ? '❤️' : '🤍' }}
                </button>
              </div>

              <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div class="space-y-1">
                  <router-link 
                    :to="`/vendor-profile/${encodeURIComponent(product.shopName)}`" 
                    class="text-[9px] font-black text-gray-400 uppercase tracking-wider block hover:text-[#d61f43] transition cursor-pointer"
                  >
                    {{ product.shopName }}
                  </router-link>
                  
                  <h3 
                    @click="goToDetail(product.id)" 
                    class="text-xs font-black text-gray-950 uppercase line-clamp-1 cursor-pointer hover:text-[#d61f43]"
                  >
                    {{ product.name }}
                  </h3>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div class="flex items-baseline gap-2">
                    <span class="font-mono text-sm font-black text-gray-950">€{{ product.price }}</span>
                    <span class="font-mono text-[10px] font-bold text-gray-400 line-through">€{{ (product.price * 1.35).toFixed(2) }}</span>
                  </div>

                  <button 
                    @click="addToCartGlobal(product)"
                    class="px-3 py-2 bg-[#d61f43] hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition shadow-sm"
                  >
                    ⚡ BLEJ TANI
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

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { products, categories, users, addToCartGlobal, wishlist, toggleWishlist } from '../store/productStore'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref('TË GJITHA')
const sortBy = ref('default')
const minPrice = ref(null)
const maxPrice = ref(null)

const initialShop = route.query.shop ? [route.query.shop] : []
const selectedBrands = ref(initialShop)

const dynamicBrands = computed(() => {
  const userShops = users.value.filter(u => u.role === 'vendor' && u.shopName).map(u => u.shopName)
  const productShops = products.value.map(p => p.shopName)
  return [...new Set([...userShops, ...productShops])]
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (selectedCategory.value !== 'TË GJITHA') {
    result = result.filter(p => 
      (p.name && p.name.toUpperCase().includes(selectedCategory.value)) || 
      (p.category && p.category.toUpperCase() === selectedCategory.value)
    )
  }

  if (selectedBrands.value.length > 0) {
    result = result.filter(p => selectedBrands.value.includes(p.shopName))
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.shopName && p.shopName.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  }

  if (minPrice.value !== null && minPrice.value !== '') {
    result = result.filter(p => p.price >= Number(minPrice.value))
  }
  if (maxPrice.value !== null && maxPrice.value !== '') {
    result = result.filter(p => p.price <= Number(maxPrice.value))
  }


  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

const isWishlisted = (id) => wishlist.value.some(item => item.id === id)
const goToDetail = (id) => router.push(`/product/${id}`)
</script>