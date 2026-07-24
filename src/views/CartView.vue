<template>
  <div class="p-8 max-w-[1400px] mx-auto space-y-8 min-h-screen bg-[#0f1111] text-gray-100">
    <h1 class="text-3xl font-black text-white">Shporta Juaj</h1>

    <div v-if="cart.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- ANAJSA E MAJTË: Produktet në Shportë -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cart" 
          :key="item.id + '-' + item.selectedVariant" 
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-gray-800 bg-gray-900/10 hover:bg-gray-900/20 transition-all gap-4"
        >
          <div class="flex items-center gap-4">
            <span class="text-3xl bg-gray-950/60 p-3 rounded-xl border border-gray-800">{{ item.icon }}</span>
            <div>
              <h3 class="font-bold text-white text-base hover:text-blue-400 transition">{{ item.name }}</h3>
              <p class="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-1.5">
                <span>Kategoria: {{ item.category }}</span>
                <span class="text-gray-700">•</span>
                <span class="text-indigo-400 font-semibold">🏬 {{ item.shopName }}</span>
                <span v-if="item.selectedVariant" class="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                  Opsioni: {{ item.selectedVariant }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
            <div class="flex items-center bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              <button @click="decreaseQty(item)" class="px-3 py-1.5 hover:bg-gray-900 text-gray-400 hover:text-white transition font-bold">-</button>
              <span class="px-3 py-1.5 text-sm font-mono font-bold text-white">{{ item.quantity }}</span>
              <button @click="increaseQty(item)" class="px-3 py-1.5 hover:bg-gray-900 text-gray-400 hover:text-white transition font-bold">+</button>
            </div>

            <div class="text-right flex items-center gap-4">
              <span class="text-lg font-black text-white font-mono">{{ (item.price * item.quantity).toFixed(2) }} €</span>
              <button @click="removeItem(item.id, item.selectedVariant)" class="text-gray-500 hover:text-red-400 transition text-sm">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ANAJSA E DJATHTË: Përmbledhja e Porosisë dhe Përfundimi përmes WhatsApp -->
      <div class="lg:col-span-1">
        <div class="p-6 rounded-2xl border border-gray-800 bg-gray-900/20 backdrop-blur-sm space-y-6 sticky top-24">
          <h3 class="text-lg font-bold text-white border-b border-gray-800 pb-3">Përmbledhja e Porosisë</h3>
          
          <!-- Të dhënat e kontaktit të klientit (Të nevojshme për porosinë përmes WhatsApp) -->
          <div class="space-y-3">
            <label class="block text-xs font-bold uppercase text-gray-400 tracking-wider">Shënimet e Dërgesës</label>
            <input v-model="customerName" type="text" placeholder="Emri dhe Mbiemri" class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition" />
            <input v-model="customerCity" type="text" placeholder="Qyteti (p.sh: Prizren)" class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition" />
          </div>

          <div class="space-y-3 text-sm border-t border-gray-800/60 pt-4">
            <div class="flex justify-between text-gray-400">
              <span>Nëntotali</span>
              <span class="font-mono text-white">{{ subTotal.toFixed(2) }} €</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Transporti</span>
              <span class="font-mono text-emerald-400">{{ shippingFee === 0 ? 'Falas' : shippingFee + ' €' }}</span>
            </div>
            <div class="border-t border-gray-800/60 pt-3 flex justify-between text-base font-bold text-white">
              <span>Totali i Përgjithshëm</span>
              <span class="font-mono text-xl text-blue-400">{{ totalAmount.toFixed(2) }} €</span>
            </div>
          </div>

          <!-- Butoni i WhatsApp për Porosi Live -->
          <button 
            @click="handleWhatsAppCheckout" 
            class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>💬</span> Porosit përmes WhatsApp
          </button>
          
          <p class="text-[10px] text-gray-500 text-center">
            Kur të konfirmoni porosinë, detajet e produktit dërgohen direkt në linjën WhatsApp të dyqanit përkatës.
          </p>
        </div>
      </div>

    </div>

    <!-- Ekrani i Shportës së Zbrazët -->
    <div v-else class="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-gray-900/5 max-w-xl mx-auto">
      <span class="text-6xl">🛒</span>
      <h2 class="text-xl font-bold text-white mt-6">Shporta juaj është e zbrazët</h2>
      <p class="text-gray-400 text-sm mt-2 max-w-sm mx-auto">Nuk ka asnjë produkt në shportë. Eksploroni dyqanet tona për të gjetur ofertat më të mira.</p>
      <router-link to="/" class="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg">
        Kthehu te Dyqani
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cart, saveCartToStorage } from '../store/productStore'

const customerName = ref('')
const customerCity = ref('')

const subTotal = computed(() => cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0))
const shippingFee = computed(() => (subTotal.value > 150 || subTotal.value === 0 ? 0 : 3))
const totalAmount = computed(() => subTotal.value + shippingFee.value)

const increaseQty = (item) => {
  if (item.quantity < item.stock) {
    item.quantity++
    saveCartToStorage()
  }
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    saveCartToStorage()
  }
}

const removeItem = (id, variant) => {
  cart.value = cart.value.filter(item => !(item.id === id && item.selectedVariant === variant))
  saveCartToStorage()
}

// Motorri i Porosisë WhatsApp
const handleWhatsAppCheckout = () => {
  if (!customerName.value || !customerCity.value) {
    alert('Ju lutem plotësoni emrin dhe qytetin tuaj!')
    return
  }

  const targetPhoneNumber = '38344XXXXXX'

  let message = `🛒 *NEXMALL - POROSI E RE*\n\n`
  message += `👤 *Klienti:* ${customerName.value}\n`
  message += `📍 *Qyteti:* ${customerCity.value}\n`
  message += `----------------------------------\n`

  cart.value.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.selectedVariant || 'Normal'})\n`
    message += `   » ${item.quantity} x ${item.price.toFixed(2)} € = ${(item.quantity * item.price).toFixed(2)} €\n`
    message += `   🏪 _Dyqani: ${item.shopName}_\n\n`
  })

  message += `----------------------------------\n`
  message += `📦 *Transporti:* ${shippingFee.value === 0 ? 'Falas' : shippingFee.value + ' €'}\n`
  message += `💰 *TOTALI PËR PAGESË:* ${totalAmount.value.toFixed(2)} €\n\n`
  message += `Ju lutem konfirmoni porosinë time! 🙏`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhoneNumber}&text=${encodedMessage}`

  cart.value = []
  saveCartToStorage()
  window.open(whatsappUrl, '_blank')
}
</script>