<template>
  <div class="min-h-screen bg-slate-50/50 py-8 px-4 md:px-6">
    <div class="max-w-4xl mx-auto space-y-6">

      <div v-if="shopUser" class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-6">
        <img 
          :src="shopUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'" 
          class="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-md" 
          alt="Mağaza Logosu" 
        />
        <div class="space-y-2 text-center sm:text-left flex-1">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 rounded-lg text-[10px] font-black text-[#d61f43] uppercase tracking-widest">
            Dyqan i Aprovuar
          </div>
          <h1 class="text-2xl font-black text-slate-950 uppercase tracking-tight">{{ shopUser.shopName || shopUser.name }}</h1>
          <p class="text-xs text-slate-500 font-bold">Përfaqësuesi: {{ shopUser.name }} | E-posta: {{ shopUser.email }}</p>
        </div>
        <router-link to="/" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-xl transition">
          ← Faqja Kryesore
        </router-link>
      </div>

      <div v-else class="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-xl text-center space-y-4">
        <span class="text-4xl block">🏪</span>
        <h2 class="text-sm font-black text-slate-900 uppercase">Dyqani nuk u gjet</h2>
        <p class="text-xs text-slate-400">Ky dyqan mund të jetë mbyllur ose emri është i pasaktë.</p>
        <router-link to="/" class="inline-block px-6 py-3 bg-slate-950 text-white text-[11px] font-black uppercase tracking-widest rounded-xl">
          Kthehu Prapa
        </router-link>
      </div>

      <div v-if="shopUser" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-black text-slate-950 uppercase tracking-widest">
            📦 Produktet e këtij dyqani ({{ shopProducts.length }})
          </h3>
        </div>

        <div v-if="shopProducts.length === 0" class="bg-white p-12 rounded-2xl border border-slate-100 text-center text-xs text-slate-400 font-bold">
          Ky dyqan nuk ka shtuar ende asnjë produkt.
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div 
            v-for="product in shopProducts" 
            :key="product.id" 
            class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
          >
            <div class="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer" @click="goToDetail(product.id)">
              <img 
                v-if="product.images && product.images.length > 0" 
                :src="product.images[0]" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
              />
              <div v-else class="w-full h-full flex items-center justify-center text-3xl">📦</div>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div class="space-y-1">
                <h3 
                  @click="goToDetail(product.id)" 
                  class="text-xs font-black text-slate-950 uppercase line-clamp-1 cursor-pointer hover:text-[#d61f43]"
                >
                  {{ product.name }}
                </h3>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                <span class="font-mono text-sm font-black text-slate-950">€{{ product.price }}</span>
                <button 
                  @click="addToCartGlobal(product)"
                  class="px-3 py-2 bg-[#d61f43] hover:bg-rose-700 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition shadow-sm"
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
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { users, products, addToCartGlobal } from '../store/productStore'

const route = useRoute()
const router = useRouter()

const shopNameParam = decodeURIComponent(route.params.shopName || '')

const shopUser = computed(() => {
  return users.value.find(u => 
    u.shopName && u.shopName.toLowerCase() === shopNameParam.toLowerCase()
  )
})

const shopProducts = computed(() => {
  if (!shopUser.value) return []
  return products.value.filter(p => 
    p.shopName && p.shopName.toLowerCase() === shopUser.value.shopName.toLowerCase()
  )
})

const goToDetail = (id) => router.push(`/product/${id}`)
</script>