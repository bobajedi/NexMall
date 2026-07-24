<template>
  <div class="min-h-screen bg-[#f4f6f9] py-10 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Area e Titullit -->
      <div class="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-black text-gray-900 uppercase tracking-tight">
            {{ lang === 'en' ? 'Favorite Products' : 'Produktet e Preferuara' }}
          </h1>
          <p class="text-xs text-gray-400 font-bold uppercase mt-1">
            ❤️ {{ wishlist.length }} {{ lang === 'en' ? 'Products in list' : 'Produkte në listë' }}
          </p>
        </div>
        
        <router-link to="/" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-black uppercase rounded-xl hover:border-gray-900 transition shadow-sm">
          {{ lang === 'en' ? 'Continue Shopping' : 'Vazhdo Blerjen' }}
        </router-link>
      </div>

      <!-- Lista Grid e Produkteve të Preferuara (Stili ShopAz) -->
      <div v-if="wishlist.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          v-for="product in wishlist" 
          :key="product.id"
          class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition relative group"
        >
          <!-- Distinktivi i Zbritjes (Vlerë e paracaktuar statike ose dinamike si -35%) -->
          <span class="absolute top-3 left-3 bg-[#d61f43] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase z-10">
            -35%
          </span>

          <!-- Butoni i Zemrës (Largon nga lista kur klikohet) -->
          <button 
            @click="onToggleWishlist(product)"
            class="absolute top-3 right-3 w-7 h-7 bg-white border border-gray-100 rounded-full flex items-center justify-center text-xs shadow-sm text-[#d61f43] hover:scale-110 transition z-10"
          >
            ❤️
          </button>

          <!-- Kutia e Imazhit të Produktit -->
          <div class="aspect-square bg-white rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
            <img 
              :src="product.images?.[0] || product.image" 
              class="max-h-[140px] object-contain group-hover:scale-105 transition duration-300"
              :alt="product.name"
            />
          </div>

          <!-- Informacionet e Produktit -->
          <div class="space-y-1 flex-1 flex flex-col justify-between">
            <div>
              <!-- Emri i Dyqanit -->
              <span class="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                {{ product.shopName || 'NexMall Store' }}
              </span>
              
              <!-- Emri i Produktit -->
              <router-link 
                :to="'/product/' + product.id"
                class="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#d61f43] transition uppercase tracking-tight h-8 block mt-0.5"
              >
                {{ product.name }}
              </router-link>
            </div>

            <!-- Fusha e Çmimit -->
            <div class="pt-2 flex items-baseline gap-2">
              <span class="text-sm font-mono font-black text-[#d61f43]">
                €{{ product.price.toFixed(2) }}
              </span>
              <span class="text-[10px] font-mono font-bold text-gray-400 line-through">
                €{{ (product.price * 1.45).toFixed(2) }}
              </span>
            </div>

            <!-- Butonat e Aksionit ShopAz (Blej Tani + Ikona e Shportës) -->
            <div class="flex gap-1.5 pt-3">
              <button 
                @click="handleAddToCart(product)"
                :disabled="product.stock <= 0"
                :class="product.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#d61f43] hover:bg-[#b51433] text-white'"
                class="flex-1 py-2 font-black text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 active:scale-[0.98]"
              >
                ⚡ <span>{{ product.stock <= 0 ? (lang === 'en' ? 'Out of Stock' : 'Pa Stok') : (lang === 'en' ? 'Buy Now' : 'Blej tani') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gjendja e Listës Bosh -->
      <div v-else class="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm mt-10">
        <span class="text-4xl block mb-3">❤️</span>
        <h3 class="text-sm font-black text-gray-800 uppercase tracking-wider">
          {{ lang === 'en' ? 'Your wishlist is empty' : 'Lista juaj është boshte' }}
        </h3>
        <p class="text-xs text-gray-400 mt-1 font-medium">
          {{ lang === 'en' ? 'You have not added any products to your wishlist yet.' : 'Nuk keni shtuar asnjë produkt në listën e dëshirave.' }}
        </p>
        <router-link to="/" class="mt-6 inline-block px-6 py-3 bg-gray-950 text-white text-xs font-black uppercase rounded-xl hover:bg-gray-800 transition shadow-sm">
          {{ lang === 'en' ? 'Explore Products' : 'Eksploro Produktet' }}
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { wishlist, toggleWishlist, addToCartGlobal, isCartOpen } from '../store/productStore'

// Mbështetja e gjuhës (Injektohet nga App.vue)
const lang = inject('lang', ref('al'))

// Aktivizuesi i largimit nga të preferuarat
const onToggleWishlist = (product) => {
  toggleWishlist(product)
}

// Motorri i shtimit të drejtpërdrejtë në shportë
const handleAddToCart = (product) => {
  // Nëse produkti ka variante, është më e sigurt të ridrejtohet te faqja e detajeve
  if (product.variants && product.variants.length > 0) {
    window.location.href = `/product/${product.id}`
    return
  }

  const success = addToCartGlobal(product, '')
  if (success) {
    isCartOpen.value = true
  }
}
</script>