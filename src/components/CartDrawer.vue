<template>
  <div v-if="isCartOpen" class="fixed inset-0 z-50 overflow-hidden">
    <div @click="isCartOpen = false" class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

    <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col">

        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-base font-black text-gray-950 uppercase tracking-wider">SHPORTA E BLERJEVE</h2>
          <button @click="isCartOpen = false" class="text-gray-400 hover:text-gray-900 p-2 font-black text-sm">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="cart.length === 0" class="text-center py-16 space-y-3">
            <span class="text-4xl block">🛒</span>
            <p class="text-xs font-black text-gray-400 uppercase tracking-wider">Shporta juaj është e zbrazët.</p>
          </div>

          <div v-for="(item, index) in cart" :key="item.id ?? index" class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 text-xs">
            <div class="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
              <img v-if="item.images && item.images.length > 0" :src="item.images[0]" class="w-full h-full object-cover" />
              <span v-else class="text-xl">📦</span>
            </div>

            <div class="flex-1 min-w-0 space-y-1">
              <span class="font-black text-gray-950 uppercase block truncate">{{ item.name }}</span>
              <span class="font-mono text-emerald-600 font-black block">€{{ item.price }}</span>
              
              <div class="flex items-center gap-2 pt-1">
                <button @click="decreaseQty(item)" class="w-6 h-6 bg-white border border-gray-200 rounded font-black text-gray-700 hover:border-gray-900">-</button>
                <span class="font-mono font-black text-gray-900">{{ item.quantity }}</span>
                <button @click="increaseQty(item)" class="w-6 h-6 bg-white border border-gray-200 rounded font-black text-gray-700 hover:border-gray-900">+</button>
              </div>
            </div>

            <button @click="removeFromCart(item)" class="text-red-500 p-2 hover:bg-red-50 rounded-lg">🗑️</button>
          </div>
        </div>

        <div v-if="cart.length > 0" class="p-6 border-t border-gray-100 space-y-4 bg-gray-50">
          <div class="flex justify-between items-center text-sm font-black text-gray-950">
            <span>TOTALI</span>
            <span class="font-mono text-emerald-600 text-lg">€{{ cartTotal.toFixed(2) }}</span>
          </div>

          <router-link 
            to="/checkout" 
            @click="isCartOpen = false"
            class="block w-full py-4 bg-[#d61f43] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest text-center rounded-xl transition shadow-sm"
          >
            PËRFUNDO POROSINË
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cart, isCartOpen, saveCartToStorage } from '../store/productStore'

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const increaseQty = (item) => {
  if (item.quantity < item.stock) {
    item.quantity++
    saveCartToStorage()
  } else {
    alert('Nuk ka më produkte në stok!')
  }
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    saveCartToStorage()
  } else {
    removeFromCart(item)
  }
}

const removeFromCart = (item) => {
  const index = cart.value.findIndex(p => p.id === item.id)
  if (index > -1) {
    cart.value.splice(index, 1)
    saveCartToStorage()
  }
}
</script>