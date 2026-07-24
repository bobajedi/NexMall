<template>
  <div class="min-h-screen bg-[#f4f6f9] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm space-y-6">

      <div class="text-center space-y-2">
        <h1 class="text-3xl font-black tracking-tight text-gray-900">
          NEX<span class="text-[#d61f43]">MALL</span>
        </h1>
        <p class="text-xs font-black text-gray-400 uppercase tracking-wider">
          Kyqu në llogarinë tuaj
        </p>
      </div>

      <div v-if="error" class="text-[10px] font-black text-[#d61f43] bg-red-50 p-3 rounded-xl border border-red-100 uppercase tracking-wider">
        ⚠ {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            E-Mail ose Emri i Përdoruesit
          </label>
          <input 
            v-model="username" 
            type="text" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 text-xs font-bold transition bg-gray-50 focus:bg-white"
            placeholder="name@example.com"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
            Fjalëkalimi
          </label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-0 text-xs font-bold transition bg-gray-50 focus:bg-white"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between pt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              v-model="rememberMe" 
              type="checkbox" 
              class="w-4 h-4 rounded text-[#d61f43] border-gray-300 focus:ring-0" 
            />
            <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              Më kujto mua
            </span>
          </label>
        </div>

        <button 
          type="submit"
          class="w-full py-3.5 bg-[#d61f43] hover:bg-[#b51433] text-white font-black text-xs uppercase tracking-widest rounded-xl transition duration-200 shadow-md shadow-[#d61f43]/10 active:scale-[0.99]"
        >
          Kyqu Tani
        </button>
      </form>

      <div class="text-center pt-2">
        <p class="text-xs text-gray-400 font-medium">
          Nuk keni llogari?
          <router-link to="/register" class="text-[#d61f43] font-black uppercase hover:underline ml-1">
            Regjistrohu
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../store/productStore'

const router = useRouter()
const lang = inject('lang', ref('al'))

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

onMounted(() => {
  const savedUser = localStorage.getItem('nexmall_remembered_username')
  if (savedUser) {
    username.value = savedUser
    rememberMe.value = true
  }
})

const handleLogin = () => {
  error.value = ''
  const typedInput = username.value.trim()
  const result = loginUser(typedInput, password.value)

  if (result.success) {
    if (rememberMe.value) {
      localStorage.setItem('nexmall_remembered_username', typedInput)
    } else {
      localStorage.removeItem('nexmall_remembered_username')
    }
    router.push('/dashboard')
  } else {
    error.value = result.message || 'Kredencialet e gabuara ose përdoruesi nuk ekziston!'
  }
}
</script>