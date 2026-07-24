<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
    <div class="max-w-4xl mx-auto space-y-8">

      <div class="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 class="text-2xl font-black text-gray-950 uppercase tracking-tight">🛒 PËRFUNDO POROSINË</h1>
          <p class="text-xs text-gray-400 font-bold mt-1">Porositni produktet në shportën tuaj në mënyrë të sigurt.</p>
        </div>
        <router-link to="/" class="px-4 py-2.5 border border-gray-200 hover:border-gray-900 bg-white text-xs font-black uppercase tracking-wider rounded-xl transition">
          KTHEHU TE DYQANI
        </router-link>
      </div>

      <div v-if="cart.length === 0" class="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
        <span class="text-4xl block">🛍️</span>
        <h2 class="text-base font-black text-gray-950 uppercase">SHPORTA JUAJ ÉSHTË BOSHE</h2>
        <p class="text-xs text-gray-400 font-bold">Mund të ktheheni në faqen kryesore për të vazhduar blerjet.</p>
        <router-link to="/" class="inline-block px-6 py-3 bg-gray-950 text-white text-xs font-black uppercase tracking-wider rounded-xl">
          FILLO BLERJET
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <div class="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 class="text-base font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
            📍 TË DHËNAT E DORËZIMIT
          </h2>

          <form @submit.prevent="handleSubmitOrder" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Emri dhe Mbiemri</label>
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Edi Bobaj"
                class="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Numri i Telefonit</label>
              <input 
                v-model="form.phone" 
                type="text" 
                required 
                placeholder="+383 44 000 000"
                class="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
              />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Adresa e Dorëzimit</label>
              <textarea 
                v-model="form.address" 
                rows="3" 
                required 
                placeholder="Lagjja, Rruga, Nr, Qyteti"
                class="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-gray-900 outline-none resize-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Shënimi i Porosisë (Opsionale)</label>
              <input 
                v-model="form.note" 
                type="text" 
                placeholder="Mos i bi ziles etj."
                class="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-gray-900 outline-none"
              />
            </div>

            <button 
              type="submit" 
              class="w-full py-4 bg-[#d61f43] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-sm mt-4"
            >
              KONFIRMO DHE PËRFUNDO POROSINË (€{{ cartTotal.toFixed(2) }})
            </button>
          </form>
        </div>

        <div class="md:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 class="text-base font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
            📦 PËRMBLEDHJA E SHPORTËS
          </h2>

          <div class="divide-y divide-gray-100 max-h-[350px] overflow-y-auto pr-1">
            <div v-for="(item, index) in cart" :key="item.id ?? index" class="py-3 flex items-center justify-between gap-4 text-xs">
              <div class="min-w-0 flex-1">
                <span class="font-black text-gray-900 uppercase block truncate">{{ item.name }}</span>
                <span class="font-mono text-gray-400 font-bold block">{{ item.quantity }} Copë x €{{ item.price }}</span>
              </div>
              <span class="font-mono font-black text-gray-900">€{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 space-y-2">
            <div class="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Nëntotali</span>
              <span class="font-mono">€{{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Transporti</span>
              <span class="font-mono text-emerald-600 font-black">FALAS</span>
            </div>
            <div class="flex justify-between items-center text-sm font-black text-gray-950 pt-2 border-t border-gray-100">
              <span>Totali i Përgjithshëm</span>
              <span class="font-mono text-emerald-600 text-lg">€{{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cart, checkoutSubmitGlobal } from '../store/productStore'

const router = useRouter()

const form = reactive({
  name: '',
  phone: '',
  address: '',
  note: ''
})

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const handleSubmitOrder = () => {
  const result = checkoutSubmitGlobal(form)
  if (result.success) {
    alert('Porosia juaj u krijua me sukses!')
    router.push('/')
  } else {
    alert(result.message)
  }
}
</script>