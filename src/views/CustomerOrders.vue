<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Zona e Titullit -->
      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex justify-between items-center">
        <div>
          <span class="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            📦 Paneli i Klientit
          </span>
          <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">Porositë e Mia dhe Gjurmimi i Dërgesave</h1>
        </div>
        <router-link to="/" class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase rounded-xl transition">
          ← Kthehu te Ballafaqja
        </router-link>
      </div>

      <!-- Lista e Porosive -->
      <div v-if="myOrders.length > 0" class="space-y-4">
        <div v-for="order in myOrders" :key="order.id" class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
            <div>
              <span class="text-xs font-mono font-black text-gray-900">Numri i Porosisë: {{ order.id }}</span>
              <p class="text-[11px] font-bold text-gray-400 mt-0.5">Data: {{ order.date }} | Dyqani: {{ order.shopName }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-black uppercase rounded-lg font-mono">
                Gjurmimi: {{ order.trackingCode }}
              </span>
              <span class="px-3 py-1 text-[10px] font-black uppercase rounded-lg" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Produktet -->
          <div class="space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center text-xs font-bold text-gray-700 bg-gray-50 p-3 rounded-2xl">
              <span>{{ item.name }} ({{ item.quantity }} Copë)</span>
              <span class="text-[#d61f43]">€{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-gray-50 text-xs font-black">
            <span class="text-gray-400 uppercase">Totali i Pagesës:</span>
            <span class="text-emerald-600 text-base">€{{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-3 shadow-sm">
        <span class="text-3xl">📭</span>
        <h3 class="text-sm font-black text-gray-900 uppercase">Nuk keni asnjë porosi aktive</h3>
        <p class="text-xs font-bold text-gray-400">Pasi të bëni blerje, statusin e porosisë tuaj mund ta ndiqni këtu.</p>
        <router-link to="/" class="inline-block mt-2 px-6 py-2.5 bg-[#d61f43] text-white text-xs font-black uppercase rounded-xl transition shadow-md">
          Fillo Blerjet
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { orders, currentUser } from '../store/productStore'

const myOrders = computed(() => {
  if (!currentUser.value) return orders.value
  return orders.value.filter(o => o.customerEmail === currentUser.value.email)
})

const getStatusClass = (status) => {
  switch (status) {
    case 'Yeni Sipariş': 
    case 'Porosi e Re': return 'bg-amber-100 text-amber-700'
    case 'Hazırlanıyor': 
    case 'Duke u Përgatitur': return 'bg-blue-100 text-blue-700'
    case 'Kargoda': 
    case 'Në Transport': return 'bg-purple-100 text-purple-700'
    case 'Tamamlandı': 
    case 'E Përfunduar': return 'bg-emerald-100 text-emerald-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>