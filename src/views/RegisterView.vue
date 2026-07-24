<template>
  <div class="min-h-screen bg-[#f4f6f9] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm space-y-6">
      
      <!-- Logo & Titull -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-black tracking-tight text-gray-900">
          NEX<span class="text-[#d61f43]">MALL</span>
        </h1>
        <p class="text-xs font-black text-gray-400 uppercase tracking-wider">
          {{ lang === 'al' ? 'Krijo Llogari të Re' : 'Yeni Hesap Oluştur' }}
        </p>
      </div>

      <!-- Formuari i Regjistrimit -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        
        <!-- Fusha e Ngarkimit të Logos së Profilit/Dyqanit -->
        <div class="flex flex-col items-center justify-center space-y-2 pb-1">
          <div class="relative group">
            <img 
              :src="form.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'" 
              class="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200 shadow-sm transition group-hover:border-[#d61f43]" 
            />
            <label class="absolute inset-0 bg-black/40 text-white text-[9px] font-black uppercase flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-2xl cursor-pointer">
              {{ lang === 'al' ? 'Ndrysho' : 'Seç' }}
              <input type="file" accept="image/*" @change="handleAvatarUpload" class="hidden" />
            </label>
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {{ form.role === 'seller' ? (lang === 'al' ? 'Logo e Dyqanit' : 'Mağaza Logosu') : (lang === 'al' ? 'Foto e Profilit' : 'Profil Fotoğrafı') }}
          </span>
        </div>

        <!-- Zgjedhja e Rolit -->
        <div class="space-y-1.5">
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
            {{ lang === 'al' ? 'Roli i Llogarisë' : 'Hesap Rolü' }}
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button" 
              @click="form.role = 'customer'" 
              :class="form.role === 'customer' ? 'bg-[#d61f43] text-white shadow-sm' : 'bg-gray-50 text-gray-500 border border-gray-200'"
              class="py-2.5 rounded-xl text-xs font-black uppercase transition active:scale-[0.98]"
            >
              🛒 {{ lang === 'al' ? 'Klient' : 'Müşteri' }}
            </button>
            <button 
              type="button" 
              @click="form.role = 'seller'" 
              :class="form.role === 'seller' ? 'bg-[#d61f43] text-white shadow-sm' : 'bg-gray-50 text-gray-500 border border-gray-200'"
              class="py-2.5 rounded-xl text-xs font-black uppercase transition active:scale-[0.98]"
            >
              🏪 {{ lang === 'al' ? 'Shitës' : 'Satıcı' }}
            </button>
          </div>
        </div>

        <!-- Emri & Mbiemri -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
              {{ lang === 'al' ? 'Emri' : 'Adı' }}
            </label>
            <input 
              v-model="form.firstName" 
              type="text" 
              required 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 text-xs font-bold uppercase transition bg-gray-50 focus:bg-white" 
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
              {{ lang === 'al' ? 'Mbiemri' : 'Soyadı' }}
            </label>
            <input 
              v-model="form.lastName" 
              type="text" 
              required 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 text-xs font-bold uppercase transition bg-gray-50 focus:bg-white" 
            />
          </div>
        </div>

        <!-- Emri i Dyqanit (Vetëm për Shitës) -->
        <div v-if="form.role === 'seller'" class="space-y-1.5">
          <label class="block text-[10px] font-black text-[#d61f43] uppercase tracking-wider">
            {{ lang === 'al' ? 'Emri i Dyqanit (Shop Name)' : 'Mağaza / Dükkan Adı' }}
          </label>
          <input 
            v-model="form.shopName" 
            type="text" 
            required 
            placeholder="Prizren Tech, Diva Butik..." 
            class="w-full px-4 py-2.5 rounded-xl border border-[#d61f43]/30 focus:border-gray-900 focus:ring-0 text-xs font-bold uppercase transition bg-red-50/30 focus:bg-white" 
          />
        </div>

        <!-- E-Mail -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-gray-400 block">E-Mail</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 text-xs font-bold transition bg-gray-50 focus:bg-white" 
            placeholder="name@example.com"
          />
        </div>

        <!-- Fjalëkalimi -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            {{ lang === 'al' ? 'Fjalëkalimi' : 'Şifre' }}
          </label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 text-xs font-bold transition bg-gray-50 focus:bg-white" 
            placeholder="••••••••"
          />
        </div>

        <!-- Butoni i Regjistrimit -->
        <button 
          type="submit" 
          class="w-full py-3.5 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase tracking-widest rounded-xl transition duration-200 shadow-md shadow-[#d61f43]/10 active:scale-[0.99]"
        >
          {{ lang === 'al' ? 'Regjistrohu Tani' : 'Hesap Oluştur' }}
        </button>
      </form>

      <!-- Lidhja për te Hyrja -->
      <div class="text-center pt-2">
        <p class="text-xs text-gray-400 font-medium">
          {{ lang === 'al' ? 'Keni një llogari?' : 'Zaten hesabınız var mı?' }}
          <router-link to="/login" class="text-[#d61f43] font-black uppercase hover:underline ml-1">
            {{ lang === 'al' ? 'Kyqu këtu' : 'Giriş Yap' }}
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../store/productStore'

const router = useRouter()
const lang = inject('lang', ref('al'))

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'customer',
  shopName: '',
  avatar: ''
})

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleRegister = () => {
  const fullName = `${form.value.firstName.trim()} ${form.value.lastName.trim()}`
  
  const result = registerUser({
    name: fullName,
    email: form.value.email,
    password: form.value.password,
    role: form.value.role === 'seller' ? 'vendor' : 'customer',
    shopName: form.value.role === 'seller' ? form.value.shopName : '',
    avatar: form.value.avatar
  })

  alert(result.message)

  if (result.success) {
    router.push('/login')
  }
}
</script>