<template>
  <div class="bg-[#030408] min-h-screen text-slate-200 font-sans p-6 md:p-12">
    <div class="max-w-6xl mx-auto">

      <div v-if="!currentUser" class="max-w-md mx-auto my-16 bg-[#07090f] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl shadow-blue-950/20 relative overflow-hidden">
        <div class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div class="text-center space-y-2">
          <div class="text-4xl">🏪</div>
          <h2 class="text-2xl font-black uppercase tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Hyrja e Menaxhmentit
          </h2>
          <p class="text-xs text-slate-500">
            Kyquni për menaxhimin e dyqanit dhe gjurmimin e porosive.
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4 pt-2">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Emri i Përdoruesit
            </label>
            <input v-model="authForm.username" type="text" required placeholder="Përcaktoni emrin e përdoruesit" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Fjalëkalimi
            </label>
            <input v-model="authForm.password" type="password" required placeholder="Shkruani fjalëkalimin" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Emri i Dyqanit
            </label>
            <input v-model="authForm.shopName" type="text" required placeholder="P.sh: Diva Butik Prizren" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95">
            🚀 Kyqu dhe Hap Panelin
          </button>
        </form>

        <div class="text-center pt-2">
          <router-link to="/" class="text-[11px] text-slate-500 hover:text-slate-300 transition">
            ← Kthehu te Dyqani
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-8">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div class="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <span>🟢 Sesioni Aktiv:</span>
              <span class="text-white underline">{{ currentUser.shopName }}</span>
            </div>
            <h1 class="text-3xl font-black uppercase tracking-tight mt-1">
              Paneli i Administratorit
            </h1>
          </div>
          <div class="flex items-center gap-3">
            <router-link to="/" class="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition">
              ← Kthehu te Vitrina
            </router-link>
            <button @click="logoutUser" class="px-4 py-2.5 bg-red-950/20 hover:bg-red-900/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition cursor-pointer">
              Dalja e Sigurt ✕
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div class="lg:col-span-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
            <div class="flex justify-between items-center border-b border-white/5 pb-4">
              <h2 class="text-sm font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                📥 Rrjedha e Porosive ({{ myOrders.length }})
              </h2>
            </div>

            <div v-if="myOrders.length === 0" class="text-center py-20 text-slate-500 italic text-xs">
              Nuk ka asnjë regjistrim porosie aktive të drejtuar në dyqanin tuaj.
            </div>

            <div v-else class="space-y-4">
              <div v-for="order in myOrders" :key="order.id" class="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                <div class="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span class="text-[9px] font-mono text-blue-400 block">{{ order.id }}</span>
                    <span class="text-[9px] text-slate-500">{{ order.date }}</span>
                  </div>
                  <span class="px-2.5 py-0.5 bg-blue-950/80 border border-blue-500/30 text-blue-400 font-bold rounded-lg text-[9px] uppercase tracking-wider">
                    {{ order.status }}
                  </span>
                </div>

                <div class="flex justify-between text-xs font-bold">
                  <span>{{ order.productName }}</span>
                  <span class="font-mono text-slate-400">{{ order.quantity }} Copë x {{ order.price }} €</span>
                </div>

                <div v-if="order.selectedVariant" class="text-xs text-amber-400 font-semibold bg-amber-500/5 border border-amber-500/10 px-2 py-1 rounded-lg">
                  Opsioni: {{ order.selectedVariant }}
                </div>

                <div class="bg-black/50 p-3 rounded-xl space-y-1 text-[11px] border border-white/5 text-slate-400">
                  <div><strong>Klienti:</strong> {{ order.customerName }}</div>
                  <div><strong>Qyteti:</strong> {{ order.customerCity || 'E paspecifikuar' }}</div>
                </div>

                <div class="flex justify-between items-center pt-1">
                  <span class="text-[10px] text-slate-500">Të ardhurat:</span>
                  <span class="text-sm font-bold text-emerald-400 font-mono">{{ order.total.toFixed(2) }} €</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
            <h2 class="text-sm font-black uppercase tracking-wider text-amber-400">
              ✨ Shto Produkt në Dyqan
            </h2>

            <form @submit.prevent="handleCreateProduct" class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                  Emri i Produktit
                </label>
                <input v-model="newProduct.name" type="text" required placeholder="P.sh: Fustan i Kuq Saten" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Çmimi (€)
                  </label>
                  <input v-model.number="newProduct.price" type="number" step="0.01" required placeholder="0.00" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none font-mono" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Stoku
                  </label>
                  <input v-model.number="newProduct.stock" type="number" required placeholder="0" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none font-mono" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                  Kategoria
                </label>
                <select v-model="newProduct.category" required class="w-full px-4 py-2.5 bg-[#07090f] border border-white/10 rounded-xl text-xs text-white focus:outline-none">
                  <option value="" disabled selected>Zgjidhni Sektorin</option>
                  <option value="fashion">👗 Fashion / Butik</option>
                  <option value="furniture">🛋️ Furniture / Mobilje</option>
                  <option value="lighting">💡 Lighting / Ndriçim</option>
                  <option value="tech">💻 Tech / Elektronik</option>
                </select>
              </div>

              <div class="border border-white/5 bg-black/20 p-4 rounded-xl space-y-3">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Lloji i Variacionit
                  </label>
                  <input v-model="newProduct.variantType" type="text" placeholder="P.sh: Madhësia, Pëlhura, Watt" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">
                    Opsionet (Ndani me presje)
                  </label>
                  <input v-model="variantsInput" type="text" placeholder="P.sh: S, M, L ose Gri, Bezhë" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
                  <p class="text-[9px] text-slate-500">
                    Vlerat e futura do të shndërrohen në butonat e zgjedhjes.
                  </p>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                  Përshkrimi i Produktit
                </label>
                <textarea v-model="newProduct.description" rows="2" placeholder="Shkruani veçoritë e produktit..." class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none resize-none"></textarea>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase">
                  Ngarko Pamjen
                </label>
                <div class="border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl p-6 bg-black/40 text-center relative transition duration-300">
                  <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div class="space-y-1.5">
                    <span class="text-xl">📁</span>
                    <p class="text-[10px] text-slate-400">
                      Zgjidh skedarin ose lësho këtu
                    </p>
                    <p v-if="newProduct.imageUrl" class="text-[9px] text-emerald-400 mt-1">
                      Pamja u Përgatit ✓
                    </p>
                  </div>
                </div>
              </div>

              <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-amber-500/10">
                🚀 Lësho Produktin në Shitje
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { 
  currentUser, 
  registerUser, 
  logoutUser, 
  products, 
  orders, 
  saveProductsToStorage 
} from '../store/productStore'

const lang = inject('lang', ref('al'))

const authForm = ref({ username: '', password: '', shopName: '' })
const newProduct = ref({ name: '', price: null, stock: null, category: '', imageUrl: '', description: '', variantType: '' })
const variantsInput = ref('')

const myOrders = computed(() => {
  if (!currentUser.value || !Array.isArray(orders.value)) return []
  return orders.value.filter(order => order && order.shopName === currentUser.value.shopName)
})

const handleRegister = () => {
  if (registerUser(authForm.value.username, authForm.value.password, authForm.value.shopName)) {
    authForm.value = { username: '', password: '', shopName: '' }
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.src = e.target.result
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = 400
      canvas.height = 400
      ctx.drawImage(img, 0, 0, 400, 400)
      
      newProduct.value.imageUrl = canvas.toDataURL('image/jpeg', 0.7)
    }
  }
  reader.readAsDataURL(file)
}

const handleCreateProduct = () => {
  if (!currentUser.value) return

  if (!newProduct.value.imageUrl) {
    alert('Ju lutemi zgjidhni një pamje të vlefshme për produktin!')
    return
  }

  const processedVariants = variantsInput.value
    ? variantsInput.value.split(',').map(v => v.trim()).filter(v => v.length > 0)
    : []

  products.value.push({
    id: Date.now(),
    name: newProduct.value.name.trim(),
    price: Number(newProduct.value.price) || 0,
    stock: Number(newProduct.value.stock) || 0,
    category: newProduct.value.category,
    images: [newProduct.value.imageUrl],
    description: newProduct.value.description.trim() || 'Nuk ka përshkrim produkti.',
    shopName: currentUser.value.shopName,
    variantType: newProduct.value.variantType.trim() || 'Opsioni',
    variants: processedVariants
  })

  saveProductsToStorage()
  alert('Urime! Produkti u shtua me sukses në vitrinë.')
  
  newProduct.value = { name: '', price: null, stock: null, category: '', imageUrl: '', description: '', variantType: '' }
  variantsInput.value = ''
}
</script>