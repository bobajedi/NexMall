<template>
  <div class="min-h-screen bg-slate-50/50 py-8 px-4 md:px-6">
    <div class="max-w-4xl mx-auto bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      
      <!-- Butonët e Zgjedhjes së Gjuhës -->
      <div class="flex justify-end gap-2 mb-6">
        <button 
          v-for="langOption in ['sq', 'en']" 
          :key="langOption"
          @click="currentLang = langOption"
          :class="['px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition', currentLang === langOption ? 'bg-slate-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
        >
          {{ langOption === 'sq' ? 'Shqip' : 'English' }}
        </button>
      </div>

      <!-- Gjendja: Produkti nuk u gjet -->
      <div v-if="!product" class="text-center py-20 space-y-4">
        <div class="w-16 h-16 bg-rose-50 text-[#d61f43] rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-inner">
          📦
        </div>
        <div class="space-y-1">
          <h2 class="text-sm font-black text-slate-900 uppercase tracking-wider">{{ t.notFound }}</h2>
          <p class="text-[11px] text-slate-400 max-w-xs mx-auto">{{ t.notFoundDesc }}</p>
        </div>
        <router-link to="/" class="inline-block px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition shadow-lg shadow-slate-900/20">
          {{ t.backHome }}
        </router-link>
      </div>

      <!-- Përmbajtja e Detajeve të Produktit -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <!-- ZONA E GALERISË SË IMAZHEVE (Dizajn më i vogël) -->
        <div class="space-y-4">
          <!-- Imazhi i Madh Aktiv -->
          <div class="bg-slate-100 rounded-2xl w-full max-w-[280px] mx-auto aspect-square overflow-hidden border border-slate-100 flex items-center justify-center relative group shadow-sm">
            <img 
              v-if="selectedImage" 
              :src="selectedImage" 
              class="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
              alt="Imazhi i Produktit"
            />
            <span v-else class="text-4xl text-slate-300">📦</span>
            <router-link 
              :to="`/vendor-profile/${encodeURIComponent(product.shopName)}`"
              class="absolute top-3 left-3 bg-white/90 hover:bg-white backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-900 shadow-sm transition hover:text-[#d61f43]"
            >
              {{ product.shopName }}
            </router-link>
          </div>

          <!-- Parapamjet e Imazheve të Vogla (Galeria Thumbnail) -->
          <div v-if="product.images && product.images.length > 1" class="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="selectedImage = img"
              :class="['w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 shadow-sm', selectedImage === img ? 'border-[#d61f43] scale-95 shadow-md shadow-[#d61f43]/20' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95']"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- INFORMACIONET DHE PËRSHKRIMI I PRODUKTIT -->
        <div class="space-y-6">
          <div class="space-y-2">
            <router-link 
              :to="`/vendor-profile/${encodeURIComponent(product.shopName)}`"
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[10px] font-black text-[#d61f43] uppercase tracking-widest transition"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[#d61f43]"></span>
              {{ product.shopName }}
            </router-link>
            <h1 class="text-2xl font-black text-slate-950 uppercase tracking-tight leading-tight">{{ product.name }}</h1>
            <div class="text-2xl font-mono font-black text-emerald-600">€{{ product.price }}</div>
          </div>

          <div class="flex items-center gap-4 text-[11px] text-slate-500 font-bold border-y border-slate-100 py-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              {{ t.stock }}: <span class="font-mono text-slate-900 font-black">{{ product.stock }} {{ t.units }}</span>
            </div>
          </div>

          <!-- PËRSHKRIMI I PRODUKTIT -->
          <div class="space-y-2">
            <h3 class="text-[11px] font-black text-slate-900 uppercase tracking-wider">{{ t.description }}</h3>
            <p class="text-[11px] text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100/80 whitespace-pre-line">
              {{ product.description || t.noDescription }}
            </p>
          </div>

          <!-- BUTONAT -->
          <div class="flex items-center gap-3 pt-2">
            <button 
              @click="addToCartGlobal(product)"
              class="flex-1 py-3.5 bg-[#d61f43] hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-[#d61f43]/25 hover:shadow-lg hover:shadow-[#d61f43]/40 active:scale-[0.98]"
            >
              {{ t.addToCart }}
            </button>
            <router-link to="/" class="px-6 py-3.5 border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl hover:border-slate-900 hover:bg-slate-50 transition-all text-center">
              {{ t.goBack }}
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { products, addToCartGlobal } from '../store/productStore'

const route = useRoute()
const productId = Number(route.params.id)

const product = computed(() => {
  return products.value.find(p => p.id === productId)
})

const selectedImage = ref('')
const currentLang = ref('sq') // Gjuha e parazgjedhur: Shqip ('sq', 'en')

// Fjalori Shumëgjuhësh (Vetëm Shqip dhe Anglisht)
const translations = {
  sq: {
    notFound: 'Produkti nuk u gjet',
    notFoundDesc: 'Produkti që po kërkoni nuk ekziston ose mund të jetë larguar.',
    backHome: 'Kthehu në Ballafaqe',
    stock: 'Gjendja e Stoku',
    units: 'Copë',
    description: 'Përshkrimi i Produktit',
    noDescription: 'Nuk është futur ende asnjë përshkrim për këtë produkt.',
    addToCart: 'Shto në Shportë',
    goBack: 'Kthehu Prapa'
  },
  en: {
    notFound: 'Product not found',
    notFoundDesc: 'The product you are looking for does not exist or might have been removed.',
    backHome: 'Back to Home',
    stock: 'Stock Status',
    units: 'Units',
    description: 'Product Description',
    noDescription: 'No description has been entered for this product yet.',
    addToCart: 'Add to Cart',
    goBack: 'Go Back'
  }
}

const t = computed(() => translations[currentLang.value])

// Zgjidh imazhin e parë si parazgjedhje kur të ngarkohet produkti
watchEffect(() => {
  if (product.value && product.value.images && product.value.images.length > 0) {
    selectedImage.value = product.value.images[0]
  } else {
    selectedImage.value = ''
  }
})
</script>