<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Shiriti i Sipërm -->
      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="text-[10px] font-black bg-[#d61f43]/10 text-[#d61f43] px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Menaxhimi i Sistemit - Detajet e Dyqanit dhe Analiza Financiare
          </span>
          <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">
            🏪 {{ vendor?.shopName || 'Dyqan i Panjohur' }}
          </h1>
        </div>
        <router-link to="/dashboard" class="px-4 py-2 bg-gray-900 text-white text-xs font-black uppercase rounded-xl transition">
          Kthehu te Paneli i Adminit
        </router-link>
      </div>

      <div v-if="!vendor" class="bg-white p-12 text-center rounded-3xl text-gray-400 font-bold uppercase text-xs">
        Dyqani nuk u gjet.
      </div>

      <template v-else>
        <!-- Kartat e Avancuara të Llogaritjes Financiare (Të Ardhurat / Shpenzimet / Komisioni / Fitimi Net) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase text-gray-400">Qarkullimi Bruto (Të Ardhurat)</span>
            <div class="text-2xl font-black text-emerald-600">€{{ totalRevenue.toFixed(2) }}</div>
          </div>
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase text-gray-400">Komisioni i Platformës (10%)</span>
            <div class="text-2xl font-black text-amber-600">€{{ commissionFee.toFixed(2) }}</div>
          </div>
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase text-gray-400">Shpenzimet / Kostoja e Vlerësuar</span>
            <div class="text-2xl font-black text-red-500">€{{ estimatedExpense.toFixed(2) }}</div>
          </div>
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-2">
            <span class="text-[10px] font-black uppercase text-gray-400">Fitimi Net</span>
            <div class="text-2xl font-black text-blue-600">€{{ netProfit.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Produktet e Shitura dhe Porositë e Dyqanit -->
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            📦 Historiku i Shitjeve & Detajet për këtë Dyqan
          </h2>

          <div v-if="vendorOrders.length === 0" class="text-center py-8 text-gray-400 text-xs font-bold uppercase">
            Nuk ka pasur ende shitje nga ky dyqan.
          </div>

          <div v-else class="space-y-4">
            <div v-for="order in vendorOrders" :key="order.id" class="border border-gray-100 bg-gray-50 rounded-2xl p-4 space-y-3">
              <div class="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span class="text-xs font-mono font-black text-gray-900">ID e Porosisë: {{ order.id }}</span>
                <span class="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase">{{ order.date }}</span>
              </div>
              <div class="text-xs text-gray-600 font-bold space-y-1">
                <p>👤 Klienti: {{ order.customerName }} | 📞 {{ order.customerPhone }}</p>
                <p>📍 Adresa: {{ order.customerAddress }}</p>
                <div class="bg-white p-3 rounded-xl border border-gray-100 mt-2 space-y-1">
                  <p class="text-[10px] uppercase text-gray-400 font-black">Produktet e Shitura:</p>
                  <ul class="list-disc list-inside">
                    <li v-for="item in order.items.filter(i => i.shopName === vendor.shopName)" :key="item.id">
                      {{ item.name }} - {{ item.quantity }} Copë (€{{ item.price }})
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { users, orders } from '../store/productStore'

const route = useRoute()
const vendorEmail = route.params.email

const vendor = computed(() => {
  return users.value.find(u => u.email === vendorEmail)
})

const vendorOrders = computed(() => {
  if (!vendor.value) return []
  return orders.value.filter(order => order.items.some(item => item.shopName === vendor.value.shopName))
})

const totalRevenue = computed(() => {
  let total = 0
  vendorOrders.value.forEach(order => {
    order.items.forEach(item => {
      if (item.shopName === vendor.value?.shopName) {
        total += item.price * item.quantity
      }
    })
  })
  return total
})

const commissionFee = computed(() => totalRevenue.value * 0.10) // 10% komisioni i platformës
const estimatedExpense = computed(() => totalRevenue.value * 0.40) // Kostoja e vlerësuar e produktit 40%
const netProfit = computed(() => totalRevenue.value - commissionFee.value - estimatedExpense.value)
</script>