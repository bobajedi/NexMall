<template>
  <div class="bg-[#030408] min-h-screen text-slate-200 font-sans p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- GİRİŞ / KAYIT EKRANI -->
      <div v-if="!currentUser" class="max-w-md mx-auto my-12 bg-[#07090f] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div class="text-center space-y-2">
          <div class="text-3xl">🏪</div>
          <h2 class="text-xl font-black uppercase tracking-wider text-white">
            Hyrja e Menaxhmentit
          </h2>
          <p class="text-xs text-slate-500">
            Menaxhoni dyqanin dhe porositë tuaja në një vend.
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-3.5 pt-1">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emri i Përdoruesit</label>
            <input v-model="authForm.username" type="text" required placeholder="Përcaktoni emrin" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fjalëkalimi</label>
            <input v-model="authForm.password" type="password" required placeholder="••••••••" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emri i Dyqanit</label>
            <input v-model="authForm.shopName" type="text" required placeholder="P.sh: Diva Butik" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategoria e Dyqanit</label>
            <select v-model="authForm.shopCategory" required class="w-full px-3.5 py-2.5 bg-[#07090f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500">
              <option value="" disabled selected>Zgjidhni...</option>
              <option value="electronics">Elektronikë & Teknologji</option>
              <option value="clothing">Veshje & Modë</option>
              <option value="optics">Optikë & Syze</option>
              <option value="cosmetics">Kozmetikë & Bukuri</option>
              <option value="home">Shtëpi & Mobilje</option>
              <option value="other">Të tjera</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adresa e Dyqanit</label>
            <input v-model="authForm.shopAddress" type="text" required placeholder="Rruga, Qyteti" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefoni</label>
              <input v-model="authForm.shopPhone" type="tel" required placeholder="+383..." class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp</label>
              <input v-model="authForm.whatsappNumber" type="tel" placeholder="+383..." class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <button type="submit" class="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/20">
            🚀 Kyqu dhe Hap Panelin
          </button>
        </form>

        <div class="text-center pt-1">
          <router-link to="/" class="text-[11px] text-slate-500 hover:text-slate-300 transition">
            ← Kthehu te Dyqani
          </router-link>
        </div>
      </div>

      <!-- AKTİF YÖNETİM PANELİ -->
      <div v-else class="space-y-6">
        
        <!-- ÜST HEADER BAR -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#07090f] border border-white/10 p-6 rounded-2xl shadow-xl">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Dyqani Aktiv:</span>
              <span class="text-white underline">{{ currentUser.shopName }}</span>
            </div>
            <h1 class="text-2xl font-black uppercase tracking-tight text-white">
              Paneli i Administrimit
            </h1>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <router-link to="/" class="flex-1 sm:flex-none text-center px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition">
              ← Vitrina
            </router-link>
            <button @click="logoutUser" class="flex-1 sm:flex-none px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition cursor-pointer">
              Dalja ✕
            </button>
          </div>
        </div>

        <!-- İSTATİSTİK ÖZET KARTLARI -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-[#07090f] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Porosi Totale</span>
              <h3 class="text-2xl font-black text-white font-mono">{{ myOrders.length }}</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
              📥
            </div>
          </div>
          <div class="bg-[#07090f] border border-white/10 p-5 rounded-2xl flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Të Ardhurat Totale</span>
              <h3 class="text-2xl font-black text-emerald-400 font-mono">{{ totalRevenue.toFixed(2) }} €</h3>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
              💰
            </div>
          </div>
        </div>

        <!-- ANA İÇERİK: İKİ SÜTUNLU YAPI -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- SOL TARAF: SİPARİŞLER (Kaydırma çubuklu modern liste) -->
          <div class="lg:col-span-7 bg-[#07090f] border border-white/10 rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 class="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <span>📦</span> Rrjedha e Porosive ({{ myOrders.length }})
              </h2>
            </div>

            <div v-if="myOrders.length === 0" class="text-center py-16 text-slate-500 italic text-xs">
              Nuk ka asnjë regjistrim porosie aktive në dyqanin tuaj.
            </div>

            <div v-else class="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div v-for="order in myOrders" :key="order.id" class="bg-black/40 border border-white/10 hover:border-white/20 p-4 rounded-xl space-y-3 transition">
                <div class="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <div class="space-y-0.5">
                    <span class="text-[10px] font-mono text-blue-400 font-bold">#{{ order.id }}</span>
                    <span class="text-[10px] text-slate-500 block">{{ order.date }}</span>
                  </div>
                  <span class="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-lg text-[9px] uppercase tracking-wider">
                    {{ order.status }}
                  </span>
                </div>

                <div class="flex justify-between text-xs font-bold text-white">
                  <span>{{ order.productName }}</span>
                  <span class="font-mono text-slate-300">{{ order.quantity }}x / {{ order.price }} €</span>
                </div>

                <div v-if="order.selectedVariant" class="text-[11px] text-amber-400 font-medium bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg">
                  Opsioni: {{ order.selectedVariant }}
                </div>

                <div class="bg-black/40 p-2.5 rounded-lg space-y-1 text-[11px] border border-white/5 text-slate-400">
                  <div><strong class="text-slate-300">Klienti:</strong> {{ order.customerName }}</div>
                  <div><strong class="text-slate-300">Qyteti:</strong> {{ order.customerCity || 'E paspecifikuar' }}</div>
                </div>

                <div class="flex justify-between items-center pt-1 border-t border-white/5">
                  <span class="text-[10px] text-slate-500 uppercase tracking-wider">Totali i Porosisë:</span>
                  <span class="text-sm font-bold text-emerald-400 font-mono">{{ order.total.toFixed(2) }} €</span>
                </div>
              </div>
            </div>
          </div>

          <!-- SAĞ TARAF: ÜRÜN EKLEME FORMU -->
          <div class="lg:col-span-5 bg-[#07090f] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>✨</span> Shto Produkt të Ri
            </h2>

            <form @submit.prevent="handleCreateProduct" class="space-y-3.5">
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase">Emri i Produktit</label>
                <input v-model="newProduct.name" type="text" required placeholder="P.sh: Fustan Satene" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Çmimi (€)</label>
                  <input v-model.number="newProduct.price" type="number" step="0.01" required placeholder="0.00" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Stoku</label>
                  <input v-model.number="newProduct.stock" type="number" required placeholder="0" class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase">Kategoria</label>
                <select v-model="newProduct.category" required class="w-full px-3.5 py-2.5 bg-[#07090f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="" disabled selected>Zgjidhni Sektorin</option>
                  <option value="fashion">👗 Fashion / Butik</option>
                  <option value="furniture">🛋️ Furniture / Mobilje</option>
                  <option value="lighting">💡 Lighting / Ndriçim</option>
                  <option value="tech">💻 Tech / Elektronik</option>
                </select>
              </div>

              <div class="border border-white/10 bg-black/20 p-3.5 rounded-xl space-y-3">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Lloji i Variacionit</label>
                  <input v-model="newProduct.variantType" type="text" placeholder="P.sh: Madhësia, Ngjyra" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase">Opsionet (ndani me presje)</label>
                  <input v-model="variantsInput" type="text" placeholder="P.sh: S, M, L ose E kuqe, E zezë" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase">Përshkrimi</label>
                <textarea v-model="newProduct.description" rows="2" placeholder="Veçoritë e produktit..." class="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none resize-none"></textarea>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase">Pamjet e Produktit</label>
                <div class="border-2 border-dashed border-white/10 hover:border-amber-500/40 rounded-2xl p-4 bg-black/40 text-center relative transition cursor-pointer">
                  <input type="file" multiple accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div class="space-y-1">
                    <span class="text-lg">📁</span>
                    <p class="text-[10px] text-slate-400">Zgjidh skedarin/shkarkime ose lësho këtu</p>
                    <p v-if="newProduct.images.length > 0" class="text-[9px] text-emerald-400 font-bold">{{ newProduct.images.length }} foto të zgjedhura ✓</p>
                  </div>
                </div>
              </div>

              <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/10">
                🚀 Lësho në Shitje
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

const authForm = ref({ 
  username: '', 
  password: '', 
  shopName: '',
  shopCategory: '',
  shopAddress: '',
  shopPhone: '',
  whatsappNumber: ''
})

const newProduct = ref({ 
  name: '', 
  price: null, 
  stock: null, 
  category: '', 
  images: [], 
  description: '', 
  variantType: '' 
})

const variantsInput = ref('')

const myOrders = computed(() => {
  if (!currentUser.value || !Array.isArray(orders.value)) return []
  return orders.value.filter(order => order && order.shopName === currentUser.value.shopName)
})

const totalRevenue = computed(() => {
  return myOrders.value.reduce((acc, order) => acc + (Number(order.total) || 0), 0)
})

const handleRegister = async () => {
  const result = await registerUser(
    authForm.value.username,
    authForm.value.password,
    authForm.value.shopName,
    authForm.value.shopCategory,
    authForm.value.shopAddress,
    authForm.value.shopPhone,
    authForm.value.whatsappNumber
  )

  if (result.success) {
    authForm.value = { 
      username: '', 
      password: '', 
      shopName: '',
      shopCategory: '',
      shopAddress: '',
      shopPhone: '',
      whatsappNumber: ''
    }
  }
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  newProduct.value.images = []
  await Promise.all(files.map(file => new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 500
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)
        newProduct.value.images.push(canvas.toDataURL('image/jpeg', 0.75))
        resolve()
      }
    }
    reader.readAsDataURL(file)
  })))
}

const handleCreateProduct = () => {
  if (!currentUser.value) return

  if (!newProduct.value.images.length) {
    alert('Ju lutemi zgjidhni të paktën një pamje të vlefshme për produktin!')
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
    images: [...newProduct.value.images],
    description: newProduct.value.description.trim() || 'Nuk ka përshkrim produkti.',
    shopName: currentUser.value.shopName,
    variantType: newProduct.value.variantType.trim() || 'Opsioni',
    variants: processedVariants
  })

  saveProductsToStorage()
  alert('Urime! Produkti u shtua me sukses në vitrinë.')
  
  newProduct.value = { 
    name: '', 
    price: null, 
    stock: null, 
    category: '', 
    images: [], 
    description: '', 
    variantType: '' 
  }
  variantsInput.value = ''
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>