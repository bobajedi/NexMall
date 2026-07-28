<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
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
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div class="flex items-center gap-4">
            <img :src="vendor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'" class="w-16 h-16 rounded-2xl object-cover border border-gray-200" />
            <div>
              <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider">📋 Profili i Plotë i Shitësit</h2>
              <p class="text-[11px] font-bold text-gray-500">{{ vendor?.name || 'Shitës i panjohur' }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div class="rounded-2xl bg-gray-50 p-3">
              <p class="text-[10px] uppercase text-gray-400 font-black">Email</p>
              <p class="mt-1 font-bold text-gray-800">{{ vendor?.email || '—' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-3">
              <p class="text-[10px] uppercase text-gray-400 font-black">Telefoni</p>
              <p class="mt-1 font-bold text-gray-800">{{ vendor?.shopPhone || vendor?.phone || '—' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-3">
              <p class="text-[10px] uppercase text-gray-400 font-black">Adresa</p>
              <p class="mt-1 font-bold text-gray-800">{{ vendor?.shopAddress || vendor?.address || '—' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-3">
              <p class="text-[10px] uppercase text-gray-400 font-black">WhatsApp</p>
              <p class="mt-1 font-bold text-gray-800">{{ vendor?.whatsappNumber || '—' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-3">
              <p class="text-[10px] uppercase text-gray-400 font-black">Kategoria</p>
              <p class="mt-1 font-bold text-gray-800">{{ vendor?.shopCategory || '—' }}</p>
            </div>
            <div class="rounded-2xl bg-gray-50 p-3">
              <p class="text-[10px] uppercase text-gray-400 font-black">Statusi</p>
              <p class="mt-1 font-bold text-gray-800 uppercase">{{ vendor?.status || '—' }}</p>
            </div>
          </div>
        </div>

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

        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            📦 Historiku i Shitjeve & Detajet për këtë Dyqan
          </h2>

          <div v-if="vendorOrderGroups.length === 0" class="text-center py-8 text-gray-400 text-xs font-bold uppercase">
            Nuk ka pasur ende shitje nga ky dyqan.
          </div>

          <div v-else class="space-y-4">
            <div v-for="group in vendorOrderGroups" :key="group.order.id" class="border border-gray-100 bg-gray-50 rounded-2xl p-4 space-y-3">
              <div class="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span class="text-xs font-mono font-black text-gray-900">ID e Porosisë: {{ group.order.id }}</span>
                <span class="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase">{{ group.order.date }}</span>
              </div>
              <div class="text-xs text-gray-600 font-bold space-y-1">
                <p>👤 Klienti: {{ group.order.customerName }} | 📞 {{ group.order.customerPhone }}</p>
                <p>📍 Adresa: {{ group.order.customerAddress }}</p>
                <div class="bg-white p-3 rounded-xl border border-gray-100 mt-2 space-y-1">
                  <p class="text-[10px] uppercase text-gray-400 font-black">Produktet e Shitura:</p>
                  <ul class="list-disc list-inside">
                    <li v-for="item in group.items" :key="group.order.id + '-' + item.id">
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
const vendorEmail = computed(() => {
  const rawEmail = route.params.email || ''
  return decodeURIComponent(String(rawEmail)).trim().toLowerCase()
})

const vendor = computed(() => {
  if (!vendorEmail.value) return null
  return users.value.find(u => u.email?.toLowerCase() === vendorEmail.value) || users.value.find(u => u.shopName?.toLowerCase() === vendorEmail.value)
})

const vendorOrders = computed(() => {
  if (!vendor.value) return []
  return orders.value.filter(order => Array.isArray(order.items) && order.items.some(item => item.shopName === vendor.value.shopName))
})

const vendorOrderGroups = computed(() => {
  if (!vendor.value) return []

  return vendorOrders.value.map(order => ({
    order,
    items: order.items.filter(item => item.shopName === vendor.value.shopName)
  })).filter(group => group.items.length > 0)
})

const totalRevenue = computed(() => {
  return vendorOrderGroups.value.reduce((total, group) => {
    return total + group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, 0)
})

const commissionFee = computed(() => totalRevenue.value * 0.10)
const estimatedExpense = computed(() => totalRevenue.value * 0.40)
const netProfit = computed(() => totalRevenue.value - commissionFee.value - estimatedExpense.value)
</script>