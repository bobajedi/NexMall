<template>
  <div class="min-h-screen bg-[#f4f6f9] py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="text-[10px] font-black bg-[#d61f43]/10 text-[#d61f43] px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
            Paneli i Shitësit
          </span>
          <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">
            🏪 {{ currentUser?.shopName || currentUser?.name || 'NexMall Store' }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <router-link 
            v-if="currentUser?.role === 'admin' || currentUser?.email === 'admin@shopaz.com'" 
            to="/admin-partners" 
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl transition shadow-sm"
          >
            🤝 Menaxho Aplikimet e Partnerëve
          </router-link>

          <button 
            @click="handleLogout"
            class="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase rounded-xl transition shadow-sm active:scale-[0.97]"
          >
            ❌ Çkyqu
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-fit space-y-4">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            ➕ Shto Produkt të Ri
          </h2>

          <form @submit.prevent="handleCreateProduct" class="space-y-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase text-gray-400">Emri i Produktit</label>
              <input v-model="form.name" type="text" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl uppercase transition bg-gray-50 focus:bg-white" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase text-gray-400">Çmimi (€)</label>
                <input v-model.number="form.price" type="number" step="0.01" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl transition bg-gray-50 focus:bg-white" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black uppercase text-gray-400">Stoku</label>
                <input v-model.number="form.stock" type="number" required class="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl transition bg-gray-50 focus:bg-white" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black uppercase text-gray-400">Zgjidh Imazhet</label>
              <input type="file" multiple accept="image/*" @change="handleImagesUpload" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-gray-900 file:text-white cursor-pointer" />
              <p v-if="form.images.length > 0" class="text-[10px] text-emerald-600 font-bold mt-1">
                ✓ {{ form.images.length }} foto të zgjedhura.
              </p>
            </div>

            <button type="submit" class="w-full py-3 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-[#d61f43]/10">
              💾 Lësho Produktin në Shitje
            </button>
          </form>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 class="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
              📦 Pisha e Gjurmimit të Porosive (CRM)
            </h2>

            <div v-if="filteredOrders.length > 0" class="space-y-4">
              <div v-for="order in filteredOrders" :key="order.id" class="border border-gray-100 bg-gray-50 rounded-2xl p-4 space-y-3">
                <div class="flex justify-between items-center border-b border-gray-200/60 pb-2">
                  <span class="text-xs font-mono font-black text-gray-900">{{ order.id }}</span>
                  <span class="text-[10px] font-black bg-[#d61f43] text-white px-2 py-0.5 rounded-md uppercase">{{ order.status }}</span>
                </div>
                <div class="text-xs text-gray-500 font-bold">
                  <p>👤 {{ order.customerName }} | 📞 {{ order.customerPhone }}</p>
                  <p>📍 {{ order.customerAddress }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-400 text-xs font-bold uppercase">
              Nuk ka asnjë porosi të re akoma
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, products, orders, saveProductsToStorage, logoutUser } from '../store/productStore'

const router = useRouter()
const lang = inject('lang', ref('al'))

onMounted(() => {
  if (!currentUser.value) router.push('/login')
})

const form = ref({ name: '', price: 0, stock: 10, category: 'fashion', images: [] })

const filteredOrders = computed(() => {
  if (!currentUser.value) return []
  return orders.value.filter(order => order.items.some(item => item.shopName === currentUser.value?.shopName))
})

const handleCreateProduct = () => {
  if (!form.value.images.length) {
    alert('Ju lutemi zgjidhni të paktën një imazh për produktin.')
    return
  }

  const newProduct = {
    id: Date.now(),
    name: form.value.name.trim(),
    price: parseFloat(form.value.price),
    stock: parseInt(form.value.stock),
    category: form.value.category,
    description: 'Produkt i NexMall.',
    images: [...form.value.images],
    shopName: currentUser.value?.shopName || 'NexMall Store'
  }
  products.value.unshift(newProduct)
  saveProductsToStorage()
  form.value = { name: '', price: 0, stock: 10, category: 'fashion', images: [] }
}

const handleImagesUpload = (event) => {
  const files = Array.from(event.target.files || [])
  form.value.images = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const handleLogout = () => {
  logoutUser()
  router.push('/login')
}
</script>